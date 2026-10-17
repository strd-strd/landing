"use client";

import { formatPhoneMask, PHONE_PLACEHOLDER } from "@/lib/phone-mask";

type PhoneInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
};

/** Поле телефона с маской +7 (___) ___-__-__ */
export function PhoneInput({
  id,
  name = "phone",
  value,
  onChange,
  className,
  placeholder = PHONE_PLACEHOLDER,
  autoComplete = "tel",
  required,
  disabled,
}: PhoneInputProps) {
  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete={autoComplete}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onFocus={() => {
        if (!value.trim()) onChange("+7 ");
      }}
      onChange={(event) => {
        onChange(formatPhoneMask(event.target.value));
      }}
      className={className}
    />
  );
}
