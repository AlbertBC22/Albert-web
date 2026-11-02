"use client";

import { useLocale, useTranslations } from "next-intl";
import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { sendContactMessage, type ContactState } from "@/app/[locale]/contacto/actions";
import { FormMessage, TextArea, TextField } from "@/components/admin/fields";
import BlueprintFrame from "@/components/blueprint/BlueprintFrame";
import { Button } from "@/components/blueprint/Button";

const initialState: ContactState = { status: "idle" };

// Formulario de contacto. Al enviarse correctamente, se sustituye por una confirmación.
export default function ContactForm() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Se envía a mano para conservar lo escrito si hay un error (<form action> vacía los campos).
  // El tiempo se mide aquí y no comparando con el servidor: un visitante con el reloj
  // mal puesto se descartaría en silencio.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("elapsed", String(Date.now() - mountedAt.current));
    formData.set("locale", locale);
    startTransition(() => formAction(formData));
  }

  if (state.status === "sent") {
    return (
      <BlueprintFrame className="space-y-3">
        <div role="status" className="space-y-3">
          <h2 className="text-h3 font-medium">{t("sentTitle")}</h2>
          <p className="text-ink-muted">{t("sentText")}</p>
        </div>
      </BlueprintFrame>
    );
  }

  return (
    // method="post": si se envía antes de que cargue el JavaScript, los datos no acaban en la URL
    <form method="post" onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label={t("name")} name="name" required maxLength={100} autoComplete="name" />
        <TextField label={t("email")} name="email" type="email" required maxLength={254} autoComplete="email" />
      </div>
      <TextArea label={t("message")} name="message" required maxLength={5000} rows={8} />

      {/* Campo trampa: invisible para las personas; los bots suelen rellenarlo */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          {t("trap")}
          <input type="text" name="extra_field" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <FormMessage error={state.status === "error" ? t(state.error) : null} />
      <Button type="submit" variant="accent" arrow disabled={pending} aria-busy={pending}>
        {pending ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
