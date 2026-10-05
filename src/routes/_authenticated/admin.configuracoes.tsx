import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({ component: SettingsPage });

const FIELDS = [
  ["site_name", "Nome do site", false],
  ["hero_title", "Título principal (página inicial)", false],
  ["hero_subtitle", "Subtítulo (página inicial)", true],
  ["footer_text", "Texto do rodapé", true],
  ["contact_email", "Email de contacto", false],
] as const;

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-settings"], queryFn: async () => (await supabase.from("site_settings").select("*").eq("id", 1).single()).data });
  const [f, setF] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  useEffect(() => { if (data) setF(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v ?? "")]))); }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("site_settings").update({
      site_name: f["site_name"] ?? "", hero_title: f["hero_title"] ?? "", hero_subtitle: f["hero_subtitle"] ?? "",
      footer_text: f["footer_text"] ?? "", contact_email: f["contact_email"] || null,
    }).eq("id", 1);
    setMsg(error ? error.message : "Configurações guardadas.");
    qc.invalidateQueries({ queryKey: ["settings"] });
  }
  const inp = "w-full rounded-lg border bg-background px-3 py-2 text-sm";
  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <h1 className="font-display text-3xl font-extrabold">Configurações</h1>
      {FIELDS.map(([k, label, long]) => (
        <label key={k} className="block text-sm"><span className="mb-1 block font-medium">{label}</span>
          {long
            ? <textarea rows={3} className={inp} value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
            : <input className={inp} value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}
        </label>
      ))}
      <button className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">Guardar</button>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
    </form>
  );
}
