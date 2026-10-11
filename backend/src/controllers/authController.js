import { User } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';
import { pick } from '../utils/pick.js';
import {
  REFRESH_COOKIE, refreshCookieOptions, signAccessToken, signRefreshToken, verifyRefreshToken,
} from '../utils/tokens.js';
import { Cart } from '../models/Cart.js';
import {
  createToken, emailService, hashToken, RESET_TTL_MS, VERIFY_TTL_MS,
} from '../services/email/index.js';

const issueSession = (res, user) => {
  res.cookie(REFRESH_COOKIE, signRefreshToken(user), refreshCookieOptions());
  return { user: user.toJSON(), accessToken: signAccessToken(user) };
};

/** ادغام سبد مهمان با سبد کاربر بعد از ورود. */
const mergeGuestCart = async (req, user) => {
  const guestId = req.headers['x-guest-id'];
  if (!guestId) return;
  const guestCart = await Cart.findOne({ guestId });
  if (!guestCart?.items.length) return;
  const userCart = await Cart.findOne({ user: user._id }) || new Cart({ user: user._id, items: [] });
  for (const item of guestCart.items) {
    const existing = userCart.items.find((i) => String(i.product) === String(item.product));
    if (existing) existing.quantity = Math.min(50, existing.quantity + item.quantity);
    else userCart.items.push({ product: item.product, quantity: item.quantity, priceAtAdd: item.priceAtAdd });
  }
  await userCart.save();
  await guestCart.deleteOne();
};

/** توکن تأیید ایمیل تازه روی کاربر می‌گذارد (save با فراخواننده) و توکن خام را برمی‌گرداند. */
const armVerification = (user) => {
  const { token, hash } = createToken();
  user.emailVerified = false;
  user.emailVerifyTokenHash = hash;
  user.emailVerifyExpires = new Date(Date.now() + VERIFY_TTL_MS);
  return token;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (await User.exists({ $or: [{ email }, { phone }] })) {
    throw ApiError.conflict('کاربری با این ایمیل یا شماره موبایل ثبت شده است');
  }
  const user = new User({ name, email, phone, password });
  const token = armVerification(user);
  await user.save();
  emailService.verification(user, token);
  await mergeGuestCart(req, user);
  return created(res, issueSession(res, user), 'حساب شما ساخته شد؛ لینک تأیید به ایمیل‌تان ارسال شد');
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const query = identifier.includes('@') ? { email: identifier.toLowerCase() } : { phone: identifier };
  const user = await User.findOne(query).select('+password +tokenVersion');
  // پیام یکسان تا وجود یا نبود حساب لو نرود
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('ایمیل/موبایل یا رمز عبور اشتباه است');
  }
  if (!user.isActive) throw ApiError.forbidden('حساب شما غیرفعال شده است، با پشتیبانی تماس بگیرید');

  user.lastLoginAt = new Date();
  await user.save({ validateModifiedOnly: true });
  await mergeGuestCart(req, user);
  return ok(res, issueSession(res, user), `خوش آمدید ${user.name}`);
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized('نشست معتبری وجود ندارد');
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('نشست منقضی شده است');
  }
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || !user.isActive || (user.tokenVersion ?? 0) !== payload.tv) {
    throw ApiError.unauthorized('نشست معتبر نیست');
  }
  return ok(res, issueSession(res, user), 'نشست تازه شد');
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
  }
  res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions(), maxAge: undefined });
  return ok(res, {}, 'از حساب خود خارج شدید');
});

export const me = asyncHandler(async (req, res) => ok(res, { user: req.user.toJSON() }, 'اطلاعات حساب'));

export const updateMe = asyncHandler(async (req, res) => {
  const updates = pick(req.body, ['name', 'email', 'phone']);
  const emailChanged = Boolean(updates.email) && updates.email !== req.user.email;
  if (emailChanged && await User.exists({ email: updates.email, _id: { $ne: req.user._id } })) {
    throw ApiError.conflict('این ایمیل قبلاً ثبت شده است');
  }
  Object.assign(req.user, updates);
  // ایمیل جدید باید دوباره تأیید شود
  const token = emailChanged ? armVerification(req.user) : null;
  await req.user.save({ validateModifiedOnly: true });
  if (token) emailService.verification(req.user, token);
  return ok(
    res,
    { user: req.user.toJSON() },
    token ? 'پروفایل به‌روزرسانی شد؛ لینک تأیید به ایمیل جدید ارسال شد' : 'پروفایل به‌روزرسانی شد',
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw ApiError.badRequest('رمز عبور فعلی اشتباه است');
  }
  user.password = req.body.newPassword;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1; // ابطال نشست‌های دیگر
  await user.save();
  emailService.passwordChanged(user);
  return ok(res, {}, 'رمز عبور تغییر کرد');
});

// ---------------------------------------------------------------------------
// ایمیل: تأیید و بازیابی رمز
// ---------------------------------------------------------------------------

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    emailVerifyTokenHash: hashToken(req.body.token),
    emailVerifyExpires: { $gt: new Date() },
  }).select('+emailVerifyTokenHash +emailVerifyExpires');
  if (!user) throw ApiError.badRequest('لینک تأیید نامعتبر است یا منقضی شده؛ از صفحه‌ی حساب دوباره درخواست دهید');

  user.emailVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailVerifyTokenHash = undefined;
  user.emailVerifyExpires = undefined;
  await user.save({ validateModifiedOnly: true });
  return ok(res, { user: user.toJSON() }, 'ایمیل شما تأیید شد');
});

export const resendVerification = asyncHandler(async (req, res) => {
  if (req.user.emailVerified) return ok(res, {}, 'ایمیل شما قبلاً تأیید شده است');
  const token = armVerification(req.user);
  await req.user.save({ validateModifiedOnly: true });
  emailService.verification(req.user, token);
  return ok(res, {}, 'لینک تأیید دوباره ارسال شد؛ صندوق ایمیل (و پوشه اسپم) را ببینید');
});

/**
 * پاسخ همیشه یکسان است، چه حساب وجود داشته باشد چه نه، تا از این endpoint
 * نشود فهمید چه ایمیل‌هایی در سایت ثبت‌نام کرده‌اند.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email, isActive: true });
  if (user) {
    const { token, hash } = createToken();
    await User.updateOne(
      { _id: user._id },
      { $set: { passwordResetTokenHash: hash, passwordResetExpires: new Date(Date.now() + RESET_TTL_MS) } },
    );
    emailService.passwordReset(user, token);
  }
  return ok(res, {}, 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی رمز برایش ارسال شد');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    passwordResetTokenHash: hashToken(req.body.token),
    passwordResetExpires: { $gt: new Date() },
    isActive: true,
  }).select('+password +tokenVersion +passwordResetTokenHash +passwordResetExpires');
  if (!user) throw ApiError.badRequest('لینک بازیابی نامعتبر است یا منقضی شده؛ دوباره درخواست دهید');

  user.password = req.body.password;
  user.passwordResetTokenHash = undefined; // یک‌بار مصرف
  user.passwordResetExpires = undefined;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1; // همه‌ی نشست‌ها بسته می‌شوند
  // باز کردن لینکی که به این ایمیل رفته، یعنی مالکیت ایمیل ثابت شده
  if (!user.emailVerified) {
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
  }
  await user.save();
  emailService.passwordChanged(user);
  return ok(res, {}, 'رمز عبور جدید ثبت شد؛ حالا وارد شوید');
});

// ---------------------------------------------------------------------------
// آدرس‌ها
// ---------------------------------------------------------------------------

export const listAddresses = asyncHandler(async (req, res) =>
  ok(res, { addresses: req.user.addresses }, 'لیست آدرس‌ها'));

export const addAddress = asyncHandler(async (req, res) => {
  if (req.user.addresses.length >= 8) throw ApiError.badRequest('حداکثر ۸ آدرس می‌توانید ذخیره کنید');
  req.user.addresses.push({ ...req.body, isDefault: req.body.isDefault || req.user.addresses.length === 0 });
  await req.user.save();
  return created(res, { addresses: req.user.addresses }, 'آدرس اضافه شد');
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) throw ApiError.notFound('آدرس پیدا نشد');
  address.set(req.body);
  if (req.body.isDefault) req.user.addresses.forEach((a) => { a.isDefault = String(a._id) === String(address._id); });
  await req.user.save();
  return ok(res, { addresses: req.user.addresses }, 'آدرس ویرایش شد');
});

export const removeAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) throw ApiError.notFound('آدرس پیدا نشد');
  address.deleteOne();
  await req.user.save();
  return ok(res, { addresses: req.user.addresses }, 'آدرس حذف شد');
});
