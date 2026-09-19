"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

type MyReviewsApi = {
  BlockWidget: new (options: {
    uuid: string;
    name: string;
    additionalFrame: string;
    lang: string;
    widgetId: string;
  }) => { init: () => void };
};

declare global {
  interface Window {
    myReviews?: MyReviewsApi;
  }
}

const WIDGET = {
  uuid: "27d2e4c6-6cc9-4f90-99c7-c84dc983e050",
  name: "g52527194",
  additionalFrame: "none",
  lang: "ru",
  widgetId: "0",
} as const;

export function MyReviewsWidget() {
  const started = useRef(false);

  function startWidget() {
    if (started.current || typeof window === "undefined") {
      return;
    }
    if (!window.myReviews?.BlockWidget) {
      return;
    }
    try {
      started.current = true;
      new window.myReviews.BlockWidget({ ...WIDGET }).init();
    } catch (error) {
      started.current = false;
      console.error("[web] myreviews widget init failed", {
        name: error instanceof Error ? error.name : "Unknown",
      });
    }
  }

  useEffect(() => {
    startWidget();
  }, []);

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <iframe
          id="myReviews__block-widget"
          title="Отзывы клиентов автопроката Demidov Park"
          className="block min-h-[420px] w-full border-0 outline-none"
        />
      </div>
      <Script
        src="https://myreviews.dev/widget/dist/index.js"
        strategy="lazyOnload"
        onLoad={startWidget}
        onError={() => {
          console.error("[web] myreviews script load failed", {
            src: "myreviews.dev/widget",
          });
        }}
      />
    </>
  );
}
