"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function unlockPlayback() {
      video.defaultMuted = true;
      video.muted = true;
      video.volume = 0;
      video.playsInline = true;
      video.loop = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
    }

    function tryPlay() {
      if (mediaQuery.matches) {
        video.pause();
        return;
      }
      unlockPlayback();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay may be blocked until the next chance; listeners below retry.
        });
      }
    }

    unlockPlayback();
    tryPlay();

    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", tryPlay);

    function onVisibility() {
      if (document.visibilityState === "visible" && video.paused) {
        tryPlay();
      }
    }

    function onMotionChange() {
      tryPlay();
    }

    document.addEventListener("visibilitychange", onVisibility);
    mediaQuery.addEventListener("change", onMotionChange);
    document.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    document.addEventListener("click", tryPlay, { once: true });

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("canplaythrough", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      mediaQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("touchstart", tryPlay);
      document.removeEventListener("click", tryPlay);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover brightness-110 contrast-105 motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/cadillac-poster.jpg"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/cadillac.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
        style={{ backgroundImage: "url(/cadillac-poster.jpg)" }}
        aria-hidden="true"
      />
    </>
  );
}
