"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="stack" style={{ maxWidth: 360 }}>
      <h1>Admin</h1>
      <label className="stack">Password
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      <button className="btn primary" disabled={pending}>Sign in</button>
      {state?.error && <p role="alert" style={{ color: "var(--accent)" }}>{state.error}</p>}
    </form>
  );
}
