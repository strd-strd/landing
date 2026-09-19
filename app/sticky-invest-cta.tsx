"use client";

import { useEffect, useState } from "react";

export function StickyInvestCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const lead = document.getElementById("zayavka");
      const leadTop = lead?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const scrolledPastHero = window.scrollY > window.innerHeight * 0.55;
      const nearLead = leadTop < window.innerHeight * 0.85;
      setVisible(scrolledPastHero && !nearLead);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.stickyCta = visible ? "1" : "0";
    return () => {
      document.documentElement.dataset.stickyCta = "0";
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6">
      <div className="pointer-events-auto mx-auto flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-accent/50 bg-background/95 p-3 shadow-[var(--shadow-xl)] backdrop-blur-md sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
        <p className="px-1 text-sm text-muted-foreground sm:max-w-md">
          Обсудить вход в пул инвесторов с Евгением · от 100 000 ₽
        </p>
        <a
          href="#zayavka"
          className="btn-shimmer inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
        >
          Получить консультацию
        </a>
      </div>
    </div>
  );
}
