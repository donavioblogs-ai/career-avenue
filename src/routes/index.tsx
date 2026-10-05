import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Header, Footer, JobCard } from "@/components/site";
import { JOBS, LOCATIONS, AREAS } from "@/lib/jobs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "portalvagas — Vagas de emprego em Moçambique" },
      { name: "description", content: "Vagas de emprego, estágios e consultorias em Moçambique e no resto do mundo, actualizadas diariamente." },
      { property: "og:title", content: "portalvagas — Vagas de emprego em Moçambique" },
      { property: "og:description", content: "O seu próximo emprego está a um clique." },
    ],
  }),
  component: Index,
});

export function SearchBar({ initial }: { initial?: { q?: string | undefined; local?: string | undefined; area?: string | undefined } }) {
  const nav = useNavigate();
  const [q, setQ] = useState(initial?.q ?? "");
  const [local, setLocal] = useState(initial?.local ?? "");
  const [area, setArea] = useState(initial?.area ?? "");
  const sel = "rounded-lg border bg-background px-3 py-3 text-sm text-foreground";
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); nav({ to: "/vagas", search: { q: q || undefined, local: local || undefined, area: area || undefined } }); }}
      className="grid gap-2 rounded-2xl bg-card p-3 shadow-xl md:grid-cols-[2fr_1fr_1fr_auto]"
    >
      <input className={sel} placeholder="O que procura" value={q} onChange={(e) => setQ(e.target.value)} />
      <select className={sel} value={local} onChange={(e) => setLocal(e.target.value)}>
        <option value="">Qualquer local</option>
        {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
      </select>
      <select className={sel} value={area} onChange={(e) => setArea(e.target.value)}>
        <option value="">Todas as áreas</option>
        {AREAS.map((a) => <option key={a}>{a}</option>)}
      </select>
      <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
        <Search className="h-4 w-4" /> Pesquisar
      </button>
    </form>
  );
}

function Index() {
  const stats = [
    [JOBS.length, "Vagas abertas"],
    [AREAS.length, "Áreas profissionais"],
    [LOCATIONS.length, "Locais cobertos"],
    ["24h", "Actualização diária"],
  ];
  return (
    <>
      <Header />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="inline-block rounded-full bg-primary-foreground/15 px-3 py-1 text-sm">
            <strong>{JOBS.length}</strong> vagas abertas agora
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
            O seu próximo emprego está a um clique.
          </h1>
          <p className="mt-4 max-w-2xl opacity-85">
            Reunimos todos os dias vagas de emprego, estágios e consultorias em Moçambique e no resto do mundo.
          </p>
          <div className="mt-8"><SearchBar /></div>
        </div>
      </section>
      <section className="mx-auto -mt-8 grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {stats.map(([n, l]) => (
          <div key={l} className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <p className="font-display text-3xl font-extrabold text-primary">{n}</p>
            <p className="text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Publicadas recentemente</p>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold">Vagas de emprego</h2>
            <p className="text-muted-foreground">As oportunidades mais recentes, verificadas antes de irem para o ar.</p>
          </div>
          <Link to="/vagas" search={{}} className="text-sm font-semibold text-primary hover:underline">Ver todas →</Link>
        </div>
        <div className="mt-6 grid gap-3">
          {JOBS.slice(0, 6).map((j) => <JobCard key={j.slug} job={j} />)}
        </div>
      </section>
      <Footer />
    </>
  );
}
