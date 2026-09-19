"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { CONTACTS } from "@/lib/contacts";
import { HEADER_NAV_LINKS, NAV_LINKS } from "@/lib/content";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/app/icons";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-6xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          aria-label="Demidov Park — на главную"
          className="flex min-h-11 shrink-0 cursor-pointer items-center"
        >
          <Image
            src="/logo.svg"
            alt="Demidov Park"
            width={120}
            height={28}
            className="h-7 w-auto"
            unoptimized
          />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex xl:gap-5"
          aria-label="Основное меню"
        >
          {HEADER_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={CONTACTS.phoneHref}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold text-accent transition-opacity duration-200 hover:opacity-90"
            aria-label={CONTACTS.phoneDisplay}
          >
            <PhoneIcon className="size-4 shrink-0" />
            <span className="hidden whitespace-nowrap 2xl:inline">{CONTACTS.phoneDisplay}</span>
          </a>
          <Link
            href="/#zayavka"
            className="btn-shimmer hidden min-h-11 cursor-pointer items-center whitespace-nowrap rounded-lg bg-accent px-3 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90 sm:inline-flex xl:px-4"
          >
            Консультация
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-border text-foreground xl:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="border-t border-border bg-background px-4 py-4 xl:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Мобильное меню">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-base font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={CONTACTS.phoneHref}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 font-semibold text-accent"
            >
              <PhoneIcon className="size-4" />
              {CONTACTS.phoneDisplay}
            </a>
            <Link
              href="/#zayavka"
              className="btn-shimmer mt-2 flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 font-semibold text-on-accent"
              onClick={() => setOpen(false)}
            >
              Получить консультацию
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
