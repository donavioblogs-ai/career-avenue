import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { LOCATIONS, TYPES, slugify, fmtDate } from "@/lib/jobs";

type Row = Database["public"]["Tables"]["jobs"]["Row"];
type Form = Omit<Row, "id" | "views" | "created_at" | "slug">;

export const Route = createFileRoute("/_authenticated/admin/vagas")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Gerir vagas — PortalVagas" }, { name: "description", content: "Publicação e gestão das vagas do PortalVagas." }, { property: "og:title", content: "Gerir vagas — PortalVagas" }, { property: "og:description", content: "Publicação e gestão das vagas do PortalVagas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminJobs });

const empty: Form = { title: "", company: "", company_logo: "", location: "Maputo Cidade", type: "Tempo inteiro", area: "", salary: "", deadline: "", description: "", how_to_apply: "", apply_url: "", published: true };

function AdminJobs() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [search, setSearch] = useState("");
  const { data: jobs = [] } = useQuery({
    queryKey: ["admin-jobs-list"],
    queryFn: async () => (await supabase.from("jobs").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-jobs-list"] }); qc.invalidateQueries({ queryKey: ["admin-jobs"] }); qc.invalidateQueries({ queryKey: ["jobs"] }); };

  async function remove(id: string) {
    if (!confirm("Apagar esta vaga?")) return;
    await supabase.from("jobs").delete().eq("id", id); refresh();
  }
  async function toggle(j: Row) {
    await supabase.from("jobs").update({ published: !j.published }).eq("id", j.id); refresh();
  }
  const list = jobs.filter((j) => (j.title + j.company).toLowerCase().includes(search.toLowerCase()));

  if (editing) return <JobForm job={editing === "new" ? null : editing} onDone={() => { setEditing(null); refresh(); }} />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold">Vagas</h1>
        <button onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"><Plus className="h-4 w-4" />Nova vaga</button>
      </div>
      <input placeholder="Pesquisar…" value={search} onChange={(e) => setSearch(e.target.value)} className="mt-6 w-full max-w-sm rounded-lg border bg-background px-3 py-2 text-sm" />
      <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left"><tr><th className="p-3">Vaga</th><th className="p-3">Local</th><th className="p-3">Prazo</th><th className="p-3"><Eye className="h-4 w-4" /></th><th className="p-3">Estado</th><th className="p-3"></th></tr></thead>
          <tbody>
            {list.map((j) => (
              <tr key={j.id} className="border-t">
                <td className="p-3"><p className="font-medium">{j.title}</p><p className="text-xs text-muted-foreground">{j.company}</p></td>
                <td className="p-3">{j.location}</td>
                <td className="p-3">{fmtDate(j.deadline)}</td>
                <td className="p-3">{j.views}</td>
                <td className="p-3">
                  <button onClick={() => toggle(j)} className={"rounded-full px-2 py-1 text-xs " + (j.published ? "bg-secondary text-primary" : "bg-muted text-muted-foreground")}>{j.published ? "Publicada" : "Rascunho"}</button>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(j)} className="p-2 hover:text-primary" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(j.id)} className="p-2 hover:text-destructive" aria-label="Apagar"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobForm({ job, onDone }: { job: Row | null; onDone: () => void }) {
  const [f, setF] = useState<Form>(job ? { ...empty, ...job } : empty);
  const [err, setErr] = useState("");
  const set = (k: keyof Form, v: string | boolean) => setF({ ...f, [k]: v });
  const inp = "w-full rounded-lg border bg-background px-3 py-2 text-sm";

  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const payload = { ...f, deadline: f.deadline || null, salary: f.salary || null, company_logo: f.company_logo || null, apply_url: f.apply_url || null };
    const res = job
      ? await supabase.from("jobs").update(payload).eq("id", job.id)
      : await supabase.from("jobs").insert({ ...payload, slug: `${slugify(f.title)}-${Date.now().toString(36)}` });
    if (res.error) setErr(res.error.message); else onDone();
  }
  const field = (label: string, k: keyof Form, type = "text", req = false) => (
    <label className="block text-sm"><span className="mb-1 block font-medium">{label}</span>
      <input type={type} required={req} className={inp} value={(f[k] as string) ?? ""} onChange={(e) => set(k, e.target.value)} />
    </label>
  );
  return (
    <form onSubmit={save} className="max-w-3xl space-y-4">
      <h1 className="font-display text-3xl font-extrabold">{job ? "Editar vaga" : "Nova vaga"}</h1>
      {field("Título da vaga", "title", "text", true)}
      <div className="grid gap-4 md:grid-cols-2">
        {field("Empresa", "company", "text", true)}
        {field("Logótipo (URL da imagem)", "company_logo", "url")}
        <label className="block text-sm"><span className="mb-1 block font-medium">Local</span>
          <select className={inp} value={f.location} onChange={(e) => set("location", e.target.value)}>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</select>
        </label>
        <label className="block text-sm"><span className="mb-1 block font-medium">Tipo</span>
          <select className={inp} value={f.type} onChange={(e) => set("type", e.target.value)}>{TYPES.map((l) => <option key={l}>{l}</option>)}</select>
        </label>
        {field("Área profissional", "area", "text", true)}
        {field("Salário (opcional)", "salary")}
        {field("Prazo de candidatura", "deadline", "date")}
        {field("Link para candidatura (opcional)", "apply_url", "url")}
      </div>
      <label className="block text-sm"><span className="mb-1 block font-medium">Descrição</span>
        <textarea rows={8} required className={inp} value={f.description} onChange={(e) => set("description", e.target.value)} />
      </label>
      <label className="block text-sm"><span className="mb-1 block font-medium">Como candidatar-se</span>
        <textarea rows={4} className={inp} value={f.how_to_apply} onChange={(e) => set("how_to_apply", e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} />Publicar no site</label>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <button className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">Guardar</button>
        <button type="button" onClick={onDone} className="rounded-lg border px-5 py-2">Cancelar</button>
      </div>
    </form>
  );
}
