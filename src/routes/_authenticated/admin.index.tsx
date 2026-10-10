import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Visão geral — PortalVagas" }, { name: "description", content: "Resumo das vagas e visualizações do PortalVagas." }, { property: "og:title", content: "Visão geral — PortalVagas" }, { property: "og:description", content: "Resumo das vagas e visualizações do PortalVagas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Overview });

function Overview() {
  const { data: jobs = [] } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => (await supabase.from("jobs").select("*").order("views", { ascending: false })).data ?? [],
  });
  const views = jobs.reduce((a, j) => a + j.views, 0);
  const today = new Date().toISOString().slice(0, 10);
  const cards: [string, number][] = [
    ["Total de vagas", jobs.length],
    ["Publicadas", jobs.filter((j) => j.published).length],
    ["Expiradas", jobs.filter((j) => j.deadline && j.deadline < today).length],
    ["Visualizações", views],
  ];
  const max = Math.max(1, ...jobs.map((j) => j.views));
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Visão geral</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([l, n]) => (
          <div key={l} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="font-display text-3xl font-extrabold text-primary">{n}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border bg-card p-5">
        <div className="mb-4 flex justify-between"><h2 className="font-bold">Vagas mais vistas</h2><Link to="/admin/vagas" className="text-sm text-primary">Gerir vagas →</Link></div>
        {jobs.slice(0, 10).map((j) => (
          <div key={j.id} className="mb-3">
            <div className="flex justify-between text-sm"><span className="truncate pr-4">{j.title}</span><span className="font-semibold">{j.views}</span></div>
            <div className="mt-1 h-2 rounded bg-secondary"><div className="h-2 rounded bg-primary" style={{ width: `${(j.views / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
