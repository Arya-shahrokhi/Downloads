import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Seo from '../components/common/Seo.jsx';
import { authApi } from '../services/endpoints.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { user, setUser } = useAuth();
  const [state, setState] = useState({ status: 'loading', message: '' });
  // توکن یک‌بار مصرف است؛ StrictMode افکت را دو بار اجرا می‌کند و بار دوم خطا می‌داد
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!/^[a-f0-9]{64}$/.test(token)) {
      setState({ status: 'error', message: 'لینک تأیید ناقص یا نامعتبر است.' });
      return;
    }
    authApi.verifyEmail(token)
      .then(({ data, message }) => setState({ status: 'success', message, user: data?.user }))
      .catch((err) => setState({ status: 'error', message: err.message }));
  }, [token]);

  // اگر همان کاربر لاگین است، وضعیت تأیید را بدون رفرش به‌روز کن
  useEffect(() => {
    const verified = state.user;
    if (verified && user && String(user._id || user.id) === String(verified._id || verified.id) && !user.emailVerified) {
      setUser(verified);
    }
  }, [state.user, user, setUser]);

  return (
    <>
      <Seo title="تأیید ایمیل" />
      <div className="wrap grid min-h-[calc(100dvh-var(--header-h))] items-center py-12">
        <div className="mx-auto w-full max-w-md text-center" role="status" aria-live="polite">
          {state.status === 'loading' && (
            <>
              <Spinner size={30} />
              <p className="mt-4 text-sm text-ink-500">در حال تأیید ایمیل…</p>
            </>
          )}
          {state.status === 'success' && (
            <>
              <FiCheckCircle className="mx-auto text-moss-600" size={48} />
              <h1 className="mt-5 text-2xl font-extrabold tracking-tight">{state.message}</h1>
              <p className="mt-2 text-sm text-ink-500">از این به بعد اعلان‌های سفارش را به همین ایمیل می‌فرستیم.</p>
              <div className="mt-6"><Button to={user ? '/account' : '/login'}>{user ? 'رفتن به حساب' : 'ورود به حساب'}</Button></div>
            </>
          )}
          {state.status === 'error' && (
            <>
              <FiXCircle className="mx-auto text-berry-600" size={48} />
              <h1 className="mt-5 text-xl font-extrabold tracking-tight">تأیید انجام نشد</h1>
              <p className="mt-2 text-sm leading-7 text-ink-500">{state.message}</p>
              <div className="mt-6"><Button to="/account/security" variant="outline">ارسال دوباره‌ی لینک از حساب</Button></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
