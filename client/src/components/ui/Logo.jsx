export default function Logo({ className = '', size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="17.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M20 8 C13.5 13.5 13.5 22 20 30 C26.5 22 26.5 13.5 20 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <line x1="20" y1="10" x2="20" y2="29" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="20" cy="8" r="1.5" fill="currentColor" />
    </svg>
  )
}
