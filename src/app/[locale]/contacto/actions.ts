"use server";

import { z } from "zod";
import { text } from "@/lib/admin/forms";
import { createPublicClient } from "@/lib/supabase/public";

// Envío del formulario de contacto. Guarda con el cliente público: la RLS solo permite a un
// visitante añadir mensajes (no leerlos), así que no se pide la fila de vuelta.

export type ContactState = { status: "idle" | "sent" } | { status: "error"; error: "invalid" | "failed" };

const MIN_ELAPSED_MS = 3000;

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email().max(254),
  message: z.string().min(1).max(5000),
  locale: z.enum(["es", "en"]),
});

// Antispam: campo trampa relleno o envío demasiado rápido (o sin pasar por el formulario).
function looksLikeSpam(formData: FormData) {
  const elapsed = Number(formData.get("elapsed"));
  return text(formData, "extra_field") !== "" || !(elapsed >= MIN_ELAPSED_MS);
}

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Se responde como si hubiera ido bien: el bot no aprende qué lo ha delatado
  if (looksLikeSpam(formData)) return { status: "sent" };

  const parsed = ContactSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    message: text(formData, "message"),
    locale: formData.get("locale"),
  });
  if (!parsed.success) return { status: "error", error: "invalid" };

  const { error } = await createPublicClient().from("contact_messages").insert(parsed.data);
  if (error) return { status: "error", error: "failed" };

  return { status: "sent" };
}
