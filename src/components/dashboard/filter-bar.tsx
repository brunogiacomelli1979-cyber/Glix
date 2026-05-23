import { Button } from "@/components/ui/button";
import { contexts, periods } from "@/lib/glucose";
import type { PeriodFilter } from "@/types/glucose";

type FilterBarProps = {
  selectedContext: string;
  selectedPeriod: PeriodFilter;
};

export function FilterBar({ selectedContext, selectedPeriod }: FilterBarProps) {
  return (
    <form
      action="/dashboard"
      className="grid gap-3 rounded-3xl border border-[#d8edf4] bg-white/85 p-3 shadow-sm shadow-sky-950/5 sm:grid-cols-[1fr_1fr_auto]"
    >
      <select
        name="period"
        defaultValue={selectedPeriod}
        aria-label="Filtrar por período"
        className="h-11 rounded-2xl border border-[#cfe5ed] bg-white px-3 text-sm outline-none transition focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
      >
        {periods.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        name="context"
        defaultValue={selectedContext}
        aria-label="Filtrar por contexto"
        className="h-11 rounded-2xl border border-[#cfe5ed] bg-white px-3 text-sm outline-none transition focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
      >
        <option value="todos">Todos os contextos</option>
        {contexts.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Button type="submit" className="h-11 bg-[#0f6f8f] text-white transition hover:bg-[#0b5f7b]">
        Aplicar filtros
      </Button>
    </form>
  );
}
