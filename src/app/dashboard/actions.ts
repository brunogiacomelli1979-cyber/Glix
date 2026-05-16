"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const validContexts = new Set([
  "jejum",
  "antes_refeicao",
  "pos_refeicao",
  "antes_dormir",
  "outro",
]);

export async function createGlucoseRecord(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const value = Number(formData.get("value_mgdl"));
  const context = String(formData.get("context") ?? "");
  const recordedAt = String(formData.get("recorded_at") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!Number.isInteger(value) || value <= 0 || value >= 1500) {
    redirect("/dashboard?error=Informe um valor de glicemia válido.");
  }

  if (!validContexts.has(context)) {
    redirect("/dashboard?error=Selecione um contexto válido.");
  }

  const { error } = await supabase.from("glucose_records").insert({
    user_id: user.id,
    value_mgdl: value,
    context,
    recorded_at: recordedAt ? new Date(recordedAt).toISOString() : new Date().toISOString(),
    notes: notes || null,
  });

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=Registro salvo.");
}

export async function deleteGlucoseRecord(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/dashboard?error=Registro não encontrado.");
  }

  const { error } = await supabase
    .from("glucose_records")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=Registro removido.");
}
