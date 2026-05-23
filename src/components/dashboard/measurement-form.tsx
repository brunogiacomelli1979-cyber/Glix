import { Plus } from "lucide-react";

import { createGlucoseRecord } from "@/app/dashboard/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contexts, GLUCOSE_MAX_VALUE, GLUCOSE_MIN_VALUE, NOTES_MAX_LENGTH } from "@/lib/glucose";

import { SubmitButton } from "./submit-button";

export function MeasurementForm() {
  return (
    <Card className="rounded-3xl border-[#d8edf4] bg-white/90 shadow-sm shadow-sky-950/5">
      <CardHeader>
        <CardTitle className="text-[#062338]">Nova medição</CardTitle>
        <CardDescription className="text-sm leading-6 text-[#405968]">
          Adicione um registro ao seu diário.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createGlucoseRecord} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value_mgdl">Glicemia (mg/dL)</Label>
            <Input
              id="value_mgdl"
              name="value_mgdl"
              type="number"
              min={GLUCOSE_MIN_VALUE}
              max={GLUCOSE_MAX_VALUE}
              placeholder="Ex.: 112"
              className="h-11 border-[#cfe5ed] bg-white text-base"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Contexto</Label>
            <select
              id="context"
              name="context"
              required
              className="h-11 w-full rounded-lg border border-[#cfe5ed] bg-white px-2.5 text-base outline-none transition focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
              defaultValue="jejum"
            >
              {contexts.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recorded_at">Data e horário</Label>
            <Input
              id="recorded_at"
              name="recorded_at"
              type="datetime-local"
              className="h-11 border-[#cfe5ed] bg-white text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              maxLength={NOTES_MAX_LENGTH}
              placeholder="Ex.: caminhada depois do almoço"
              className="w-full resize-none rounded-lg border border-[#cfe5ed] bg-white px-2.5 py-2 text-base outline-none transition placeholder:text-muted-foreground focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
            />
          </div>
          <SubmitButton pendingText="Salvando..." className="h-12 w-full">
            <Plus className="size-4" />
            Salvar registro
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
