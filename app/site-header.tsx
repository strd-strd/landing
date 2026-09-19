"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { CONTACTS } from "@/lib/contacts";
import { NAV_LINKS } from "@/lib/content";
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
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Demidov Park — на главную"
          className="flex min-h-11 min-w-11 cursor-pointer items-center"
        >
          <Image src="/logo.svg" alt="Demidov Park" width={134} height={32} unoptimized />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Основное меню">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CONTACTS.phoneHref}
            className="hidden min-h-11 cursor-pointer items-center gap-2 px-2 text-sm font-semibold text-accent transition-opacity duration-200 hover:opacity-90 md:inline-flex"
          >
            <PhoneIcon className="size-4" />
            {CONTACTS.phoneDisplay}
          </a>
          <Link
            href="/#zayavka"
            className="btn-shimmer hidden min-h-11 cursor-pointer items-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90 sm:inline-flex"
          >
            Получить консультацию
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
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
          className="border-t border-border bg-background px-4 py-4 lg:hidden"
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
