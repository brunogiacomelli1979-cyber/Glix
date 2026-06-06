"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseGlucoseFormData } from "@/lib/glucose";
import { createClient } from "@/utils/supabase/server";

function getCreateRedirectPath(formData: FormData) {
  const redirectTo = String(formData.get("redirect_to") ?? "");

  return redirectTo === "/registrar" ? "/registrar" : "/dashboard";
}

function getRecordRedirectPath(formData: FormData) {
  const redirectTo = String(formData.get("redirect_to") ?? "");

  return redirectTo === "/historico" ? "/historico" : "/dashboard";
}

function pageError(path: "/dashboard" | "/historico" | "/registrar", message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createGlucoseRecord(formData: FormData) {
  const redirectPath = getCreateRedirectPath(formData);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = parseGlucoseFormData(formData);

  if (!parsed.data) {
    pageError(redirectPath, parsed.error ?? "Nao foi possivel salvar o registro.");
  }

  const recordData = parsed.data;

  const { error } = await supabase.from("glucose_records").insert({
    user_id: user.id,
    ...recordData,
  });

  if (error) {
    pageError(redirectPath, error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/registrar");
  redirect(`${redirectPath}?success=${encodeURIComponent("Registro salvo.")}`);
}

export async function updateGlucoseRecord(formData: FormData) {
  const redirectPath = getRecordRedirectPath(formData);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    pageError(redirectPath, "Registro nao encontrado.");
  }

  const parsed = parseGlucoseFormData(formData);

  if (!parsed.data) {
    pageError(redirectPath, parsed.error ?? "Nao foi possivel atualizar o registro.");
  }

  const recordData = parsed.data;

  const { error } = await supabase
    .from("glucose_records")
    .update(recordData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    pageError(redirectPath, error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/historico");
  redirect(`${redirectPath}?success=${encodeURIComponent("Registro atualizado.")}`);
}

export async function deleteGlucoseRecord(formData: FormData) {
  const redirectPath = getRecordRedirectPath(formData);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    pageError(redirectPath, "Registro nao encontrado.");
  }

  const { error } = await supabase
    .from("glucose_records")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    pageError(redirectPath, error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/historico");
  redirect(`${redirectPath}?success=${encodeURIComponent("Registro removido.")}`);
}
