"use client";

import { useState } from "react";

const ANNUAL_RATE = 0.25;
const AMOUNT_MIN = 100_000;
const AMOUNT_MAX = 7_000_000;
const AMOUNT_STEP = 50_000;
const AMOUNT_DEFAULT = 500_000;

function formatRub(value: number) {
  return `${Math.round(value).toLocaleString("ru-RU")}\u00A0₽`;
}

export function InvestCalculator() {
  const [amount, setAmount] = useState(AMOUNT_DEFAULT);
  const yearly = amount * ANNUAL_RATE;
  const monthly = yearly / 12;

  return (
    <section id="kalkulyator" className="border-t border-border bg-card/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Калькулятор вложений</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl text-foreground sm:text-5xl">
            Сколько можно получать от суммы в пуле
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Выберите объём входа от 100&nbsp;000&nbsp;₽. Ориентир доходности —{" "}
            <span className="whitespace-nowrap font-semibold text-accent">25% годовых</span>. Точные
            доля и условия фиксируются на встрече.
          </p>
        </div>

        <div className="rounded-2xl border border-accent/50 bg-card p-6 shadow-[0_12px_32px_rgba(226,172,107,0.14)] sm:p-8">
          <label className="block">
            <span className="flex items-end justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">Сумма вложений</span>
              <span className="font-serif text-2xl text-foreground sm:text-3xl">
                {formatRub(amount)}
              </span>
            </span>
            <input
              type="range"
              min={AMOUNT_MIN}
              max={AMOUNT_MAX}
              step={AMOUNT_STEP}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-accent"
              aria-valuetext={formatRub(amount)}
            />
            <span className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatRub(AMOUNT_MIN)}</span>
              <span>{formatRub(AMOUNT_MAX)}</span>
            </span>
          </label>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-accent/35 bg-background/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-accent">В месяц</p>
              <p className="mt-2 font-serif text-3xl leading-tight text-foreground">
                {formatRub(monthly)}
              </p>
            </div>
            <div className="rounded-xl border border-accent/35 bg-background/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-accent">За год</p>
              <p className="mt-2 font-serif text-3xl leading-tight text-foreground">
                {formatRub(yearly)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Ориентир при 25% годовых от выбранной суммы. Не оферта — итоговые условия обсуждаются
            лично.
          </p>

          <a
            href="#zayavka"
            className="btn-shimmer mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90 sm:w-auto"
          >
            Получить консультацию
          </a>
        </div>
      </div>
    </section>
  );
}
