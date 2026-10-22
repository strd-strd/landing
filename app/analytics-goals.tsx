"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ANALYTICS_GOALS,
  classifyOutboundHref,
  trackGoal,
} from "@/lib/analytics";

/**
 * Цели: /spasibo + клики tel: / Telegram / MAX (делегирование на document).
 */
export function AnalyticsGoals() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/spasibo") return;
    trackGoal(ANALYTICS_GOALS.leadThanks, { page: "/spasibo" });
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const goal = classifyOutboundHref(href);
      if (!goal) return;

      if (goal === ANALYTICS_GOALS.phoneClick) {
        trackGoal(goal, {
          phone: href.replace(/^tel:/i, "").trim(),
        });
        return;
      }

      trackGoal(goal, { href });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
