export function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v15m0 0 6-6m-6 6-6-6" />
    </svg>
  )
}

export function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

export function LocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export function GiftIcon({ type }: { type: "shirt" | "moon" | "shoe" | "blocks" }) {
  if (type === "shirt") {
    return (
      <svg
        className="w-[34px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.7] max-[600px]:w-7"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path d="M17 9 8 14l4 9 5-2v18h14V21l5 2 4-9-9-5c-1 4-13 4-14 0Z" />
      </svg>
    )
  }

  if (type === "moon") {
    return (
      <svg
        className="w-[34px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.7] max-[600px]:w-7"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path d="M34 34A17 17 0 0 1 19 8a17 17 0 1 0 15 26Z" />
        <path d="m34 10 1.5 3 3.5.5-2.5 2.5.6 3.5-3.1-1.7-3.1 1.7.6-3.5-2.5-2.5 3.5-.5L34 10Z" />
      </svg>
    )
  }

  if (type === "shoe") {
    return (
      <svg
        className="w-[34px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.7] max-[600px]:w-7"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path d="M11 13v16c0 6 4 9 11 9h15c4 0 6-2 6-5 0-5-7-6-12-8-4-2-7-6-8-12H11Z" />
        <path d="M16 19h8m-8 5h10" />
      </svg>
    )
  }

  return (
    <svg
      className="w-[34px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.7] max-[600px]:w-7"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <rect x="7" y="23" width="17" height="17" rx="2" />
      <rect x="26" y="8" width="15" height="15" rx="2" />
      <path d="m12 35 4-7 4 7m11-17 5-5m-5 0 5 5" />
    </svg>
  )
}
