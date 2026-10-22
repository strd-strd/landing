"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { YANDEX_METRIKA_ID } from "@/lib/analytics";

export { YANDEX_METRIKA_ID };

/** Клиентские переходы App Router: первый просмотр уже в init. */
function MetrikaRouteHits() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    if (typeof window.ym !== "function") return;
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ""}`;
    window.ym(YANDEX_METRIKA_ID, "hit", url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Яндекс.Метрика. На invest пока нет cookie-баннера — грузим сразу
 * (у demidovpark — после согласия).
 */
export function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">{`
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');
window.dataLayer = window.dataLayer || [];
ym(${YANDEX_METRIKA_ID}, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  ecommerce: 'dataLayer',
  referrer: document.referrer,
  url: location.href,
  accurateTrackBounce: true,
  trackLinks: true
});
`}</Script>
      <Suspense fallback={null}>
        <MetrikaRouteHits />
      </Suspense>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
