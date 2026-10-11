import { z } from 'zod';
import { objectId, password, persianPhone } from './common.js';

export const registerSchema = {
  body: z.object({
    name: z.string().trim().min(3, 'نام حداقل ۳ کاراکتر باشد').max(80),
    email: z.string().trim().toLowerCase().email('ایمیل معتبر نیست'),
    phone: persianPhone,
    password,
  }).strict(),
};

export const loginSchema = {
  body: z.object({
    identifier: z.string().trim().min(3, 'ایمیل یا شماره موبایل را وارد کنید'),
    password: z.string().min(1, 'رمز عبور را وارد کنید'),
  }).strict(),
};

export const updateProfileSchema = {
  body: z.object({
    name: z.string().trim().min(3).max(80).optional(),
    email: z.string().trim().toLowerCase().email('ایمیل معتبر نیست').optional(),
    phone: persianPhone.optional(),
  }).strict(),
};

export const changePasswordSchema = {
  body: z.object({ currentPassword: z.string().min(1, 'رمز فعلی را وارد کنید'), newPassword: password }).strict(),
};

// توکن‌های ایمیل: ۳۲ بایت تصادفی به‌صورت hex
const emailToken = z.string().trim().regex(/^[a-f0-9]{64}$/, 'لینک نامعتبر است');

export const verifyEmailSchema = {
  body: z.object({ token: emailToken }).strict(),
};

export const forgotPasswordSchema = {
  body: z.object({ email: z.string().trim().toLowerCase().email('ایمیل معتبر نیست') }).strict(),
};

export const resetPasswordSchema = {
  body: z.object({ token: emailToken, password }).strict(),
};

export const addressSchema = {
  body: z.object({
    title: z.string().trim().max(40).optional(),
    receiver: z.string().trim().min(3, 'نام گیرنده الزامی است'),
    phone: persianPhone,
    province: z.string().trim().min(2, 'استان الزامی است'),
    city: z.string().trim().min(2, 'شهر الزامی است'),
    postalCode: z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),
    line: z.string().trim().min(10, 'آدرس کامل را وارد کنید'),
    isDefault: z.boolean().optional(),
  }).strict(),
};

export const addressIdParam = { params: z.object({ addressId: objectId }) };
