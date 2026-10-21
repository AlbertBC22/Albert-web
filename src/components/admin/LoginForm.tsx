"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/blueprint/Button";

const initialState: LoginState = { error: null, email: "" };

// Formulario de acceso al panel (email + contraseña).
export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <Field label="Email" name="email" type="email" autoComplete="username" defaultValue={state.email} />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" />

      {state.error && (
        <p role="alert" className="border-l border-red-700 pl-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="accent" arrow disabled={pending} aria-busy={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  defaultValue?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="label-mono text-ink-muted">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required
        className="block w-full border border-line bg-paper px-3 py-2.5 outline-none transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-ink"
      />
    </label>
  );
}
