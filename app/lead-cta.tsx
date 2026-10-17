"use client";

import { openLeadPopup, type LeadPopupDetail } from "@/lib/lead-popup";

const VARIANTS = {
  primary:
    "btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90",
  header:
    "btn-shimmer hidden min-h-11 cursor-pointer items-center whitespace-nowrap rounded-lg bg-accent px-3 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90 sm:inline-flex xl:px-4",
  headerMobile:
    "btn-shimmer mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-accent px-4 font-semibold text-on-accent",
  outline:
    "btn-shimmer inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-accent/60 px-5 text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent/10",
} as const;

type LeadCtaProps = {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof VARIANTS;
  detail?: LeadPopupDetail;
  onAfterOpen?: () => void;
};

/** Кнопка заявки: открывает попап вместо якоря #zayavka. */
export function LeadCta({
  children,
  className,
  variant = "primary",
  detail,
  onAfterOpen,
}: LeadCtaProps) {
  return (
    <button
      type="button"
      className={className ?? VARIANTS[variant]}
      onClick={() => {
        openLeadPopup(
          detail ?? {
            title: "Заявка на консультацию",
            subtitle: "Евгений Демидов разберёт вход, долю и условия лично.",
            context: "Интерес: консультация по инвестициям в автопарк",
          },
        );
        onAfterOpen?.();
      }}
    >
      {children}
    </button>
  );
}
