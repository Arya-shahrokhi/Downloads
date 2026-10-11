import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/layout/Logo.jsx';
import Seo from '../components/common/Seo.jsx';
import { authApi } from '../services/endpoints.js';
import { useToast } from '../context/ToastContext.jsx';
import { useSubmit } from '../hooks/index.js';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');

  const [submit, submitting] = useSubmit(async (e) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(value)) { setError('ایمیل معتبر نیست'); return; }
    setError('');
    try {
      await authApi.forgotPassword(value);
      setSentTo(value);
    } catch (err) {
      toast.error(err.message);
      setError(err.details?.email || '');
    }
  });

  return (
    <>
      <Seo title="بازیابی رمز عبور" description="دریافت لینک تعیین رمز عبور جدید" />
      <div className="wrap grid min-h-[calc(100dvh-var(--header-h))] items-center py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <Logo className="mx-auto size-11 text-moss-700" />
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight">بازیابی رمز عبور</h1>
            <p className="mt-2 text-sm text-ink-500">ایمیل حساب خود را وارد کنید تا لینک تعیین رمز جدید برایتان بفرستیم.</p>
          </div>

          {sentTo ? (
            <div className="mt-8 rounded-2xl border hairline bg-bone-100 p-6 text-center text-sm leading-8 text-ink-700" role="status">
              اگر حسابی با <b dir="ltr">{sentTo}</b> وجود داشته باشد، لینک بازیابی برایش ارسال شد.
              <br />
              لینک تا ۳۰ دقیقه معتبر است. پوشه‌ی اسپم را هم ببینید.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
              <Input
                label="ایمیل" type="email" dir="ltr" icon={FiMail} autoComplete="email"
                value={email} error={error}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="lg" className="w-full" loading={submitting}>ارسال لینک بازیابی</Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-ink-500">
            رمز یادتان آمد؟ <Link to="/login" className="font-semibold text-moss-700 hover:underline">ورود</Link>
          </p>
        </div>
      </div>
    </>
  );
}
