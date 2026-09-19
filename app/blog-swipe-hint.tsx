"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SwipeHandIcon } from "@/app/icons";

type BlogSwipeHintProps = {
  children: ReactNode;
};

export function BlogSwipeHint({ children }: BlogSwipeHintProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    function hide() {
      setVisible(false);
    }

    scroller.addEventListener("scroll", hide, { passive: true, once: true });
    scroller.addEventListener("pointerdown", hide, { once: true });
    return () => {
      scroller.removeEventListener("scroll", hide);
      scroller.removeEventListener("pointerdown", hide);
    };
  }, []);

  return (
    <div className="relative mt-10">
      <div
        ref={scrollerRef}
        className="overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {visible ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center sm:bottom-8"
          aria-hidden="true"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground/80 shadow-[var(--shadow-md)] backdrop-blur-sm">
            <SwipeHandIcon className="swipe-hint-hand size-7 shrink-0 opacity-70" />
            <span>Листайте</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
