export type LeadPopupDetail = {
  title?: string;
  subtitle?: string;
  context?: string;
  car?: string;
  year?: number;
};

export const LEAD_POPUP_EVENT = "demidov-invest:lead-popup";

export function openLeadPopup(detail: LeadPopupDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LEAD_POPUP_EVENT, {
      detail,
    }),
  );
}
