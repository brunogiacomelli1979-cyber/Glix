import { Save } from "lucide-react";

import { createGlucoseRecord } from "@/app/dashboard/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contexts, GLUCOSE_MAX_VALUE, GLUCOSE_MIN_VALUE, NOTES_MAX_LENGTH } from "@/lib/glucose";

import { SubmitButton } from "@/components/dashboard/submit-button";
import { CurrentDateTimeInput } from "@/components/measurements/current-datetime-input";

type QuickMeasurementFormProps = {
  defaultRecordedAt: string;
};

export function QuickMeasurementForm({ defaultRecordedAt }: QuickMeasurementFormProps) {
  return (
    <Card className="rounded-3xl border-[#d8edf4] bg-white/95 shadow-xl shadow-sky-950/10">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl text-[#062338]">Nova medição</CardTitle>
        <CardDescription className="text-base leading-7 text-[#405968]">
          Registre o valor agora e ajuste a data se estiver lançando uma medição antiga.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createGlucoseRecord} className="space-y-5">
          <input type="hidden" name="redirect_to" value="/registrar" />

          <div className="space-y-2">
            <Label htmlFor="value_mgdl">Glicemia (mg/dL)</Label>
            <Input
              id="value_mgdl"
              name="value_mgdl"
              type="number"
              inputMode="numeric"
              min={GLUCOSE_MIN_VALUE}
              max={GLUCOSE_MAX_VALUE}
              placeholder="Ex.: 112"
              className="h-14 border-[#cfe5ed] bg-white text-2xl font-semibold text-[#062338] placeholder:text-[#8aa1ad]"
              autoFocus
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="context">Contexto</Label>
              <select
                id="context"
                name="context"
                required
                className="h-12 w-full rounded-lg border border-[#cfe5ed] bg-white px-3 text-base text-[#082f49] outline-none transition focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
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
              <CurrentDateTimeInput defaultValue={defaultRecordedAt} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              maxLength={NOTES_MAX_LENGTH}
              placeholder="Ex.: caminhada depois do almoço"
              className="w-full resize-none rounded-lg border border-[#cfe5ed] bg-white px-3 py-3 text-base outline-none transition placeholder:text-muted-foreground focus-visible:border-[#7cc8da] focus-visible:ring-3 focus-visible:ring-[#7cc8da]/30"
            />
          </div>

          <SubmitButton pendingText="Salvando medição..." className="h-14 w-full text-base font-semibold">
            <Save className="size-5" />
            Salvar medição
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
