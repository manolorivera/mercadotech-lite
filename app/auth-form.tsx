"use client";
import { useActionState } from "react";

type Action = (s: unknown, fd: FormData) => Promise<{ error: string } | undefined>;

export default function AuthForm({ action, label }: { action: Action; label: string }) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="f">
      <input name="email" type="email" placeholder="Correo" required />
      <input name="password" type="password" placeholder="Contraseña (mínimo 6 caracteres)" minLength={6} required />
      {state?.error && <p className="err">{state.error}</p>}
      <button>{label}</button>
    </form>
  );
}
