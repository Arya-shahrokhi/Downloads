import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/layout/Logo.jsx';
import Seo from '../components/common/Seo.jsx';
import { authApi } from '../services/endpoints.js';
import { useToast } from '../context/ToastContext.jsx';
import { useSubmit } from '../hooks/index.js';

const TOKEN_RE = /^[a-f0-9]{64}$/;

export default function ResetPassword() {
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [form, setForm] = useState({ password: '', repeat: '' });
  const [errors, setErrors] = useState({});

  const [submit, submitting] = useSubmit(async (e) => {
    e.preventDefault();
    const next = {};
    if (form.password.length < 8) next.password = 'رمز حداقل ۸ کاراکتر باشد';
    else if (!/[A-Za-zآ-ی]/.test(form.password) || !/\d/.test(form.password)) next.password = 'رمز باید حرف و رقم داشته باشد';
    if (form.password !== form.repeat) next.repeat = 'تکرار رمز مطابقت ندارد';
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const { message } = await authApi.resetPassword(token, form.password);
      toast.success(message);
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message);
      setErrors(err.details || {});
    }
  });

  const invalid = !TOKEN_RE.test(token);

  return (
    <>
      <Seo title="تعیین رمز عبور جدید" />
      <div className="wrap grid min-h-[calc(100dvh-var(--header-h))] items-center py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <Logo className="mx-auto size-11 text-moss-700" />
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight">تعیین رمز عبور جدید</h1>
            <p className="mt-2 text-sm text-ink-500">بعد از تغییر رمز، از همه‌ی دستگاه‌ها خارج می‌شوید.</p>
          </div>

          {invalid ? (
            <div className="mt-8 rounded-2xl border hairline bg-bone-100 p-6 text-center text-sm leading-8 text-ink-700" role="alert">
              لینک بازیابی ناقص یا نامعتبر است.
              <div className="mt-4"><Button to="/forgot-password">درخواست لینک جدید</Button></div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
              <Input
                label="رمز جدید" type="password" icon={FiLock} autoComplete="new-password"
                value={form.password} error={errors.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              <Input
                label="تکرار رمز جدید" type="password" icon={FiLock} autoComplete="new-password"
                value={form.repeat} error={errors.repeat}
                onChange={(e) => setForm((f) => ({ ...f, repeat: e.target.value }))}
              />
              <Button type="submit" size="lg" className="w-full" loading={submitting}>ثبت رمز جدید</Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-ink-500">
            <Link to="/login" className="font-semibold text-moss-700 hover:underline">بازگشت به ورود</Link>
          </p>
        </div>
      </div>
    </>
  );
}
