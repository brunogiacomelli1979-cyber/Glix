import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { InsightCard } from "@/types/glucose";

type InsightCardsProps = {
  insights: InsightCard[];
};

export function InsightCards({ insights }: InsightCardsProps) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {insights.map((insight) => (
        <Card
          key={insight.label}
          className="rounded-2xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5 transition duration-200 hover:-translate-y-0.5"
        >
          <CardHeader className="gap-2">
            <CardDescription className="text-[#607585]">{insight.label}</CardDescription>
            <CardTitle className="text-xl text-[#062338]">{insight.value}</CardTitle>
            <p className="text-xs leading-5 text-[#7b8d98]">{insight.detail}</p>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}
