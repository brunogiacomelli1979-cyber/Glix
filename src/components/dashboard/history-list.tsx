import { CalendarClock, Pencil, Save, Trash2 } from "lucide-react";

import { deleteGlucoseRecord, updateGlucoseRecord } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  contexts,
  formatDate,
  formatDateTimeInput,
  GLUCOSE_MAX_VALUE,
  GLUCOSE_MIN_VALUE,
  NOTES_MAX_LENGTH,
} from "@/lib/glucose";
import type { GlucoseRecord } from "@/types/glucose";

import { StatusBadge } from "./status-badge";
import { SubmitButton } from "./submit-button";

type HistoryListProps = {
  highCount: number;
  records: GlucoseRecord[];
};

export function HistoryList({ highCount, records }: HistoryListProps) {
  return (
    <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
      <CardHeader>
        <div>
          <CardTitle className="text-[#062338]">Histórico</CardTitle>
          <CardDescription className="text-[#607585]">
            {records.length} registros no filtro atual. {highCount} acima de 180 mg/dL.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#b8dce8] bg-[#f8fbfc] px-4 text-center">
            <CalendarClock className="mb-3 size-8 text-[#8cb7c5]" />
            <p className="font-medium text-[#082f49]">Nenhum registro encontrado</p>
            <p className="mt-1 text-sm text-[#607585]">
              Ajuste os filtros ou salve uma nova medição.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="hidden rounded-xl bg-[#f3fbfd] px-4 py-3 text-xs font-semibold uppercase text-[#607585] md:grid md:grid-cols-[140px_1fr_140px_auto] md:gap-3">
              <span>Valor</span>
              <span>Contexto</span>
              <span>Quando</span>
              <span>Ações</span>
            </div>
            {records.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-[#e3f1f5] bg-white px-4 py-4 shadow-sm shadow-sky-950/5 transition duration-200 hover:-translate-y-0.5"
              >
                <div className="grid grid-cols-[1fr_auto] items-start gap-3 md:grid-cols-[140px_1fr_140px_auto]">
                  <div>
                    <p className="text-lg font-semibold text-[#062338]">{record.value_mgdl} mg/dL</p>
                    <div className="mt-2 md:hidden">
                      <StatusBadge value={record.value_mgdl} />
                    </div>
                    <p className="mt-1 text-xs text-[#607585] md:hidden">
                      {formatDate(record.recorded_at)}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-[#082f49]">
                        {contexts.find(([value]) => value === record.context)?.[1] ?? record.context}
                      </p>
                      <span className="hidden md:inline-flex">
                        <StatusBadge value={record.value_mgdl} />
                      </span>
                    </div>
                    {record.notes && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#607585] md:line-clamp-1">
                        {record.notes}
                      </p>
                    )}
                  </div>
                  <p className="hidden text-sm text-[#607585] md:block">
                    {formatDate(record.recorded_at)}
                  </p>
                  <form action={deleteGlucoseRecord}>
                    <input type="hidden" name="id" value={record.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      aria-label="Remover registro"
                      className="size-10 text-[#607585] hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
                <details className="mt-3 rounded-xl bg-[#f8fbfc] px-3 py-2">
                  <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm font-medium text-[#0f6f8f]">
                    <Pencil className="size-4" />
                    Editar registro
                  </summary>
                  <form action={updateGlucoseRecord} className="mt-4 grid gap-3 md:grid-cols-2">
                    <input type="hidden" name="id" value={record.id} />
                    <div className="space-y-2">
                      <Label htmlFor={`value-${record.id}`}>Glicemia (mg/dL)</Label>
                      <Input
                        id={`value-${record.id}`}
                        name="value_mgdl"
                        type="number"
                        min={GLUCOSE_MIN_VALUE}
                        max={GLUCOSE_MAX_VALUE}
                        defaultValue={record.value_mgdl}
                        className="h-10 border-[#cfe5ed] bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`context-${record.id}`}>Contexto</Label>
                      <select
                        id={`context-${record.id}`}
                        name="context"
                        required
                        className="h-10 w-full rounded-lg border border-[#cfe5ed] bg-white px-2.5 text-sm outline-none transition focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
                        defaultValue={record.context}
                      >
                        {contexts.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`recorded-${record.id}`}>Data e horário</Label>
                      <Input
                        id={`recorded-${record.id}`}
                        name="recorded_at"
                        type="datetime-local"
                        defaultValue={formatDateTimeInput(record.recorded_at)}
                        className="h-10 border-[#cfe5ed] bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`notes-${record.id}`}>Observações</Label>
                      <textarea
                        id={`notes-${record.id}`}
                        name="notes"
                        rows={3}
                        maxLength={NOTES_MAX_LENGTH}
                        defaultValue={record.notes ?? ""}
                        className="w-full resize-none rounded-lg border border-[#cfe5ed] bg-white px-2.5 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
                      />
                    </div>
                    <SubmitButton pendingText="Salvando alterações..." className="md:col-span-2">
                      <Save className="size-4" />
                      Salvar alterações
                    </SubmitButton>
                  </form>
                </details>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
