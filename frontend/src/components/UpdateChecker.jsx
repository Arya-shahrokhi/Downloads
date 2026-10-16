import { useEffect, useState } from 'react';

const CHECK_INTERVAL_MS = 60_000;

export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    let currentVersion = null;
    let active = true;
    let checking = false;

    async function checkForUpdate() {
      if (!active || checking || document.visibilityState === 'hidden') return;
      checking = true;

      try {
        const response = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) return;

        const data = await response.json();
        if (!active || typeof data.version !== 'string' || !data.version) return;

        if (currentVersion === null) {
          currentVersion = data.version;
        } else if (data.version !== currentVersion) {
          setUpdateAvailable(true);
        }
      } catch {
        // A temporary network failure is harmless; the next check will retry.
      } finally {
        checking = false;
      }
    }

    void checkForUpdate();
    const intervalId = window.setInterval(checkForUpdate, CHECK_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') void checkForUpdate();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!updateAvailable) return null;

  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        left: 16,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        padding: 16,
        color: '#222',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.14)',
      }}
    >
      <span>نسخهٔ جدید فروشگاه آماده است.</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          border: 0,
          borderRadius: 8,
          padding: '10px 16px',
          color: '#fff',
          background: '#166534',
          cursor: 'pointer',
        }}
      >
        تازه‌سازی سایت
      </button>
    </div>
  );
}
