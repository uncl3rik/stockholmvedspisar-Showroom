/** Decorative flame: CSS motion only, with a still reduced-motion fallback. */
export default function FireMark({ className = '' }: { className?: string }) {
  return <span className={`fire-mark ${className}`} aria-hidden="true">
    <svg viewBox="0 0 32 44" fill="none" focusable="false">
      <path className="fire-outer" d="M18 2C20 13 28 15 28 26C28 35 23 41 16 41C8 41 3 35 3 28C3 22 7 17 10 14C9 21 12 23 14 21C18 17 14 11 18 2Z"/>
      <path className="fire-inner" d="M17 21C18 27 23 28 22 33C22 37 19 40 16 40C12 40 10 37 10 33C10 29 14 28 17 21Z"/>
    </svg>
  </span>;
}
