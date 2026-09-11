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
