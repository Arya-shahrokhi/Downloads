import { useState } from 'react';
import { FiMail, FiPhone, FiUser, FiTag, FiCheckCircle } from 'react-icons/fi';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { contactApi } from '../../services/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSubmit } from '../../hooks/index.js';

export default function ContactForm() {
  const toast = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', subject: '', message: '', website: '',
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const [submit, submitting] = useSubmit(async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    const next = {};
    if (data.name.length < 2) next.name = 'نام خود را وارد کنید';
    if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = 'ایمیل معتبر نیست';
    if (data.phone && !/^09\d{9}$/.test(data.phone)) next.phone = 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد';
    if (data.subject.length < 3) next.subject = 'موضوع را وارد کنید';
    if (data.message.length < 10) next.message = 'پیام حداقل ۱۰ کاراکتر باشد';
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!data.phone) delete data.phone;
    if (!data.website) delete data.website;
    try {
      const { message } = await contactApi.send(data);
      toast.success(message);
      setSent(true);
    } catch (err) {
      toast.error(err.message);
      setErrors(err.details || {});
    }
  });

  if (sent) {
    return (
      <div className="rounded-2xl border hairline bg-bone-100 p-8 text-center" role="status">
        <FiCheckCircle className="mx-auto text-moss-600" size={40} />
        <p className="mt-4 font-bold">پیام شما ارسال شد</p>
        <p className="mt-2 text-sm text-ink-500">یک رسید به <span dir="ltr">{form.email.trim()}</span> فرستادیم و به‌زودی پاسخ می‌دهیم.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border hairline p-6 sm:p-8" noValidate>
      <h2 className="text-lg font-extrabold tracking-tight">برای ما بنویسید</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="نام" icon={FiUser} autoComplete="name" value={form.name} error={errors.name} onChange={set('name')} />
        <Input label="ایمیل" type="email" dir="ltr" icon={FiMail} autoComplete="email" value={form.email} error={errors.email} onChange={set('email')} />
        <Input label="موبایل (اختیاری)" type="tel" dir="ltr" inputMode="numeric" icon={FiPhone} autoComplete="tel" value={form.phone} error={errors.phone} onChange={set('phone')} />
        <Input label="موضوع" icon={FiTag} value={form.subject} error={errors.subject} onChange={set('subject')} />
      </div>
      <div>
        <label htmlFor="contact-message" className="label">پیام</label>
        <textarea
          id="contact-message" rows={6} maxLength={3000}
          className={`field min-h-[9rem] resize-y py-3 leading-7 ${errors.message ? 'field-error' : ''}`}
          aria-invalid={Boolean(errors.message)}
          value={form.message} onChange={set('message')}
        />
        {errors.message && <p className="mt-1.5 text-xs text-berry-600">{errors.message}</p>}
      </div>
      {/* honeypot: برای انسان ناپیداست، ربات‌ها پرش می‌کنند */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>وب‌سایت<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
      </div>
      <Button type="submit" size="lg" loading={submitting}>ارسال پیام</Button>
    </form>
  );
}
