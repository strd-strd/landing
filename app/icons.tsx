type IconProps = {
  className?: string;
};

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.7 4.3c.3-.9-.6-1.7-1.4-1.3L2.8 10.2c-.9.4-.8 1.7.1 2l4.7 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.6-2.6 4.6 3.4c.7.5 1.7.1 1.9-.7l2.3-15.4ZM8.4 12.8l9.3-5.7-7.3 7.9-.3 2.4-1.7-4.6Z"
      />
    </svg>
  );
}

export function MaxIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.5 5h3.2L12 12.4 16.3 5h3.2v14h-2.7V9.3L12 16.4 7.2 9.3V19H4.5V5Z"
      />
    </svg>
  );
}

export function AssistantIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        d="M8 10h8M8 14h5"
        strokeLinecap="round"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        d="M5.5 6.5h13A2.5 2.5 0 0 1 21 9v6a2.5 2.5 0 0 1-2.5 2.5H12l-4 3v-3H5.5A2.5 2.5 0 0 1 3 15V9a2.5 2.5 0 0 1 2.5-2.5Z"
      />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M7.2 3.8h3.1l1.2 3-1.8 1.1a12.6 12.6 0 0 0 6.4 6.4l1.1-1.8 3 1.2v3.1c0 .7-.6 1.3-1.3 1.3C9.8 18.1 5.9 14.2 5.9 5.1c0-.7.6-1.3 1.3-1.3Z"
      />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M4 7h16M4 12h16M4 17h16"
      />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M6 6l12 12M18 6 6 18"
      />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12.5 10 17l9-10"
      />
    </svg>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5h7.5L19 8v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M14 3.5V8h4.5M9 12h6M9 16h4"
      />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 6.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M8 4v4M16 4v4M4 10.5h16M9.5 14.5h.01M14.5 14.5h.01M9.5 17.5h.01"
      />
    </svg>
  );
}

export function KeyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.5 11.5 19 19M16.5 16.5l2 2M14.5 18.5l1.5 1.5"
      />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
}

/** Рука с 5 пальцами, указательный вытянут — подсказка свайпа. */
export function SwipeHandIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {/* Мизинец */}
      <rect x="42" y="26" width="6.5" height="16" rx="3.25" fill="currentColor" />
      {/* Безымянный */}
      <rect x="34.5" y="22" width="6.5" height="20" rx="3.25" fill="currentColor" />
      {/* Средний */}
      <rect x="27" y="20" width="6.5" height="22" rx="3.25" fill="currentColor" />
      {/* Указательный — длиннее, для свайпа */}
      <rect x="19.5" y="6" width="7" height="36" rx="3.5" fill="currentColor" />
      {/* Большой палец */}
      <path
        fill="currentColor"
        d="M12.5 34c-3.2 0-5.5 2.4-5.5 5.3 0 4.2 3.2 7.2 8.4 7.2H22v-7.8c0-2.6-2.1-4.7-4.7-4.7h-4.8Z"
      />
      {/* Ладонь */}
      <path
        fill="currentColor"
        d="M19.5 36h29c1.4 0 2.5 1.1 2.5 2.5v8.2c0 8.1-6.2 14.8-14.2 15.7l-2.1.2c-8.6.9-16.2-5.4-16.2-14V38.5c0-1.4 1.1-2.5 2.5-2.5Z"
      />
    </svg>
  );
}
