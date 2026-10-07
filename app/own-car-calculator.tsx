"use client";

import { useState } from "react";
import { openLeadPopup } from "@/lib/lead-popup";

const ANNUAL_RATE = 0.25;
const VALUE_MIN = 400_000;
const VALUE_MAX = 6_000_000;
const VALUE_STEP = 50_000;
const VALUE_DEFAULT = 1_500_000;
const YEAR_MIN = 2014;
const YEAR_MAX = new Date().getFullYear();

function formatRub(value: number) {
  return `${Math.round(value).toLocaleString("ru-RU")}\u00A0₽`;
}

export function OwnCarCalculator() {
  const [value, setValue] = useState(VALUE_DEFAULT);
  const [year, setYear] = useState(YEAR_MAX - 3);

  const yearly = value * ANNUAL_RATE;
  const monthly = yearly / 12;

  return (
    <section id="svoe-auto" className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <h2 className="max-w-xl font-serif text-4xl text-foreground sm:text-5xl">
            Рассчитайте ваш доход в зависимости от стоимости вашего автомобиля
          </h2>
        </div>

        <div className="rounded-2xl border border-accent/50 bg-card p-6 shadow-[0_12px_32px_rgba(226,172,107,0.14)] sm:p-8">
          <label className="block">
            <span className="flex items-end justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Стоимость вашего авто
              </span>
              <span className="font-serif text-2xl text-foreground sm:text-3xl">
                {formatRub(value)}
              </span>
            </span>
            <input
              type="range"
              min={VALUE_MIN}
              max={VALUE_MAX}
              step={VALUE_STEP}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-accent"
              aria-valuetext={formatRub(value)}
            />
            <span className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatRub(VALUE_MIN)}</span>
              <span>{formatRub(VALUE_MAX)}</span>
            </span>
          </label>

          <label className="mt-8 block">
            <span className="flex items-end justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">Год выпуска</span>
              <span className="font-serif text-2xl text-foreground">{year}</span>
            </span>
            <input
              type="range"
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-accent"
            />
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
            Ориентир при 25% годовых от указанной стоимости. Точная оценка и условия — после
            осмотра и разбора модели на консультации.
          </p>

          <button
            type="button"
            onClick={() =>
              openLeadPopup({
                title: "Заявка на своё авто",
                subtitle: "Оставьте контакты — согласуем осмотр и точное предложение.",
                context: `Ориентир в калькуляторе: ${formatRub(value)} · ${year} г. · ~${formatRub(monthly)}/мес`,
                car: "",
                year,
              })
            }
            className="btn-shimmer mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90 sm:w-auto"
          >
            Получить точное предложение и консультацию
          </button>
        </div>
      </div>
    </section>
  );
}
