import { env } from '../config/env.js';
import { sendSms, normalizeIranPhoneNumber } from './smsService.js';

const statusLabels = {
  PENDING: 'در انتظار تایید',
  CONFIRMED: 'تایید شده',
  PROCESSING: 'در حال آماده‌سازی',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل داده شده',
  CANCELLED: 'لغو شده',
};

const safeSend = async (to, message, label) => {
  if (!to) return;
  try {
    await sendSms(to, message);
  } catch (error) {
    // پیامک نباید ثبت سفارش/تغییر وضعیت را خراب کند.
    console.error(`[sms] ${label} failed:`, error.message);
  }
};

const toman = (amount) => new Intl.NumberFormat('fa-IR').format(Math.round(Number(amount || 0) / 10));

const shortItems = (items = []) => {
  const names = items.slice(0, 3).map((item) => item.name).join('، ');
  return items.length > 3 ? `${names} و ${items.length - 3} قلم دیگر` : names;
};

export const notifyOrderCreated = async (order, user) => {
  if (!env.sms.enabled) return;
  const orderNo = order.orderNumber || String(order._id);
  const customerPhone = order.shippingAddress?.phone || user?.phone;
  const customerMessage = `کالاوران: سفارش ${orderNo} ثبت شد. مبلغ: ${toman(order.total)} تومان. وضعیت: در انتظار تایید.`;
  const adminPhone = env.sms.adminPhone || env.admin.phone;
  const adminMessage = `سفارش جدید ${orderNo} | ${user?.name || order.shippingAddress?.receiver || 'مشتری'} | ${customerPhone || ''} | ${toman(order.total)} تومان | ${shortItems(order.items)}`;
  await Promise.all([
    safeSend(customerPhone, customerMessage, 'customer order notification'),
    safeSend(adminPhone, adminMessage, 'admin new-order notification'),
  ]);
};

export const notifyOrderStatus = async (order) => {
  if (!env.sms.enabled) return;
  const phone = order.shippingAddress?.phone;
  const status = statusLabels[order.orderStatus] || order.orderStatus;
  await safeSend(phone, `کالاوران: وضعیت سفارش ${order.orderNumber} به «${status}» تغییر کرد.`, 'order status notification');
};

export const normalizeNotificationPhone = (phone) => {
  try { return normalizeIranPhoneNumber(phone); } catch { return ''; }
};
