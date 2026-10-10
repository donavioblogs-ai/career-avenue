import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Entrar — PortalVagas" }, { name: "description", content: "Acesso ao painel do PortalVagas." }, { property: "og:title", content: "Entrar — PortalVagas" }, { property: "og:description", content: "Acesso ao painel do PortalVagas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("Email ou senha incorrectos."); else nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setMsg(error ? error.message : "Conta criada! Verifique o seu email para confirmar.");
    }
    setBusy(false);
  }
  const inp = "w-full rounded-lg border bg-background px-3 py-3 text-sm";
  return (
    <>
      <Header />
      <div className="mx-auto mt-16 max-w-sm rounded-2xl border bg-card p-8">
        <h1 className="font-display text-2xl font-extrabold">{mode === "in" ? "Entrar no painel" : "Criar conta"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input className={inp} aria-label="Email" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inp} aria-label="Senha" type="password" required minLength={6} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={busy} className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50">{mode === "in" ? "Entrar" : "Criar conta"}</button>
        </form>
        {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-primary hover:underline">
          {mode === "in" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
        </button>
      </div>
    </>
  );
}
