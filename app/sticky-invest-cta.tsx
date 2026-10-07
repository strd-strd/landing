"use client";

import { useEffect, useState } from "react";
import { openLeadPopup } from "@/lib/lead-popup";

export function StickyInvestCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastVisible = false;

    function compute() {
      const lead = document.getElementById("zayavka");
      const leadTop = lead?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const vh = window.innerHeight;
      const y = window.scrollY;

      // Гистерезис: разные пороги show/hide, чтобы бар не мигал на границе.
      const showPastHero = lastVisible ? vh * 0.42 : vh * 0.58;
      const hideNearLead = lastVisible ? vh * 0.95 : vh * 0.82;
      const next = y > showPastHero && leadTop >= hideNearLead;

      if (next === lastVisible) return;
      lastVisible = next;
      setVisible(next);
    }

    function onScrollOrResize() {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    }

    compute();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.stickyCta = visible ? "1" : "0";
    return () => {
      document.documentElement.dataset.stickyCta = "0";
    };
  }, [visible]);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 ease-out sm:px-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div
        className={`mx-auto flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-accent/50 bg-background/95 p-3 shadow-[var(--shadow-xl)] backdrop-blur-md sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4 ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <p className="px-1 text-sm text-muted-foreground sm:max-w-md">
          Обсудить вход в пул инвесторов с Евгением · от 100 000 ₽
        </p>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() =>
            openLeadPopup({
              title: "Вход в пул инвесторов",
              subtitle: "От 100 000 ₽. Евгений разберёт долю и условия на встрече.",
              context: "Интерес: вход в пул инвесторов от 100 000 ₽",
            })
          }
          className="btn-shimmer inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
        >
          Получить консультацию
        </button>
      </div>
    </div>
  );
}
