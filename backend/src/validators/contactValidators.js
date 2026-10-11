import { z } from 'zod';

export const contactSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'نام خود را وارد کنید').max(80),
    email: z.string().trim().toLowerCase().email('ایمیل معتبر نیست'),
    phone: z.union([z.string().trim().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد'), z.literal('')]).optional(),
    subject: z.string().trim().min(3, 'موضوع را وارد کنید').max(120),
    message: z.string().trim().min(10, 'پیام حداقل ۱۰ کاراکتر باشد').max(3000, 'پیام حداکثر ۳۰۰۰ کاراکتر باشد'),
    // honeypot: کاربر واقعی این فیلد مخفی را نمی‌بیند و خالی می‌گذارد
    website: z.string().max(200).optional(),
  }).strict(),
};

export const testEmailSchema = {
  body: z.object({ to: z.string().trim().toLowerCase().email('ایمیل معتبر نیست').optional() }).strict(),
};
