"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 80;

function accountRedirect(type: "error" | "success", message: string): never {
  redirect(`/conta?${type}=${encodeURIComponent(message)}`);
}

export async function updateProfileName(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim().replace(/\s+/g, " ");

  if (!fullName) {
    accountRedirect("error", "Informe seu nome.");
  }

  if (fullName.length < MIN_NAME_LENGTH) {
    accountRedirect("error", "O nome deve ter pelo menos 2 caracteres.");
  }

  if (fullName.length > MAX_NAME_LENGTH) {
    accountRedirect("error", "O nome deve ter no maximo 80 caracteres.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error) {
    accountRedirect("error", error.message);
  }

  if (!updatedProfile) {
    accountRedirect("error", "Perfil não encontrado para este usuário.");
  }

  revalidatePath("/conta");
  accountRedirect("success", "Nome atualizado.");
}
