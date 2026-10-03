/**
 * Logo: previously a 996px / 843 KB PNG was downloaded for a 36px header icon
 * (LCP + bandwidth hit on every page). Now responsive WebP variants, PNG fallback.
 */
export default function Logo({ className = '' }) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/images/brand/kalavaran-logo-64.webp 64w, /images/brand/kalavaran-logo-128.webp 128w, /images/brand/kalavaran-logo-256.webp 256w, /images/brand/kalavaran-logo-512.webp 512w"
        sizes="(min-width: 1024px) 208px, 40px"
      />
      <img
        src="/images/brand/kalavaran-logo-256.png"
        width="996"
        height="942"
        className={`object-contain ${className}`}
        alt=""
        aria-hidden="true"
        decoding="async"
        draggable="false"
      />
    </picture>
  );
}
