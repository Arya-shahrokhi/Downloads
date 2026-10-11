import mongoose from 'mongoose';

const smsOtpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  purpose: { type: String, enum: ['REGISTER'], default: 'REGISTER', required: true },
  codeHash: { type: String, required: true, select: false },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true });

smsOtpSchema.index({ phone: 1, purpose: 1, createdAt: -1 });

export const SmsOtp = mongoose.model('SmsOtp', smsOtpSchema);
