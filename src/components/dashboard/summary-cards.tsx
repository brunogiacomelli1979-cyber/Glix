import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SummaryCard } from "@/types/glucose";

import { StatusBadge } from "./status-badge";

type SummaryCardsProps = {
  cards: SummaryCard[];
};

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={`rounded-2xl border-[#d8edf4] shadow-sm shadow-sky-950/5 transition duration-200 ${
            card.featured ? "bg-[#0f6f8f] text-white" : "bg-white/90 hover:-translate-y-0.5"
          }`}
        >
          <CardHeader className="gap-2">
            <div className="flex items-start justify-between gap-2">
              <CardDescription className={card.featured ? "text-white/75" : "text-[#607585]"}>
                {card.label}
              </CardDescription>
              {!card.featured && <StatusBadge value={card.statusValue} />}
            </div>
            <CardTitle className={card.featured ? "text-3xl text-white" : "text-3xl text-[#062338]"}>
              {card.value}
              {card.unit && <span className="ml-1 text-sm font-medium opacity-80">{card.unit}</span>}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <p className={card.featured ? "text-xs text-white/75" : "text-xs text-[#7b8d98]"}>
                {card.detail}
              </p>
              {card.featured && <StatusBadge value={card.statusValue} />}
            </div>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}
