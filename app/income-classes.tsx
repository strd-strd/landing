"use client";

import { useState } from "react";
import { INCOME_CLASSES } from "@/lib/content";

export function IncomeClasses() {
  const [activeId, setActiveId] = useState<(typeof INCOME_CLASSES)[number]["id"]>(
    INCOME_CLASSES[1].id,
  );
  const active = INCOME_CLASSES.find((item) => item.id === activeId) ?? INCOME_CLASSES[1];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Класс автомобиля"
        className="flex flex-wrap gap-2"
      >
        {INCOME_CLASSES.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors duration-200 ${
                selected
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border bg-transparent text-muted-foreground hover:border-accent hover:text-foreground"
              }`}
              onClick={() => setActiveId(item.id)}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <p className="text-sm uppercase tracking-[0.18em] text-accent">{active.title}</p>
        <p className="mt-2 text-muted-foreground">{active.example}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-serif text-4xl text-foreground">{active.month}</p>
            <p className="mt-1 text-sm text-muted-foreground">ориентир в месяц</p>
          </div>
          <div>
            <p className="font-serif text-4xl text-foreground">{active.year}</p>
            <p className="mt-1 text-sm text-muted-foreground">ориентир за год</p>
          </div>
        </div>
      </div>
    </div>
  );
}
