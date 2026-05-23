"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseGlucoseFormData } from "@/lib/glucose";
import { createClient } from "@/utils/supabase/server";

function dashboardError(message: string): never {
  redirect(`/dashboard?error=${encodeURIComponent(message)}`);
}

export async function createGlucoseRecord(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = parseGlucoseFormData(formData);

  if (!parsed.data) {
    dashboardError(parsed.error ?? "Não foi possível salvar o registro.");
  }

  const recordData = parsed.data;

  const { error } = await supabase.from("glucose_records").insert({
    user_id: user.id,
    ...recordData,
  });

  if (error) {
    dashboardError(error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=Registro salvo.");
}

export async function updateGlucoseRecord(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    dashboardError("Registro não encontrado.");
  }

  const parsed = parseGlucoseFormData(formData);

  if (!parsed.data) {
    dashboardError(parsed.error ?? "Não foi possível atualizar o registro.");
  }

  const recordData = parsed.data;

  const { error } = await supabase
    .from("glucose_records")
    .update(recordData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    dashboardError(error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=Registro atualizado.");
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
    dashboardError("Registro não encontrado.");
  }

  const { error } = await supabase
    .from("glucose_records")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    dashboardError(error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=Registro removido.");
}
