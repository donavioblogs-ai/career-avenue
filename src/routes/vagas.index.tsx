import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Header, Footer, JobCard } from "@/components/site";
import { jobsQuery, settingsQuery, areasOf } from "@/lib/jobs";
import { SearchBar } from "./index";

type S = { q?: string | undefined; local?: string | undefined; area?: string | undefined };

export const Route = createFileRoute("/vagas/")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: (s["q"] as string) || undefined,
    local: (s["local"] as string) || undefined,
    area: (s["area"] as string) || undefined,
  }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(jobsQuery), context.queryClient.ensureQueryData(settingsQuery)]),
  head: () => ({
    meta: [
      { title: "Vagas de emprego — portalvagas" },
      { name: "description", content: "Pesquise todas as vagas de emprego, estágios e consultorias por local e área profissional." },
      { property: "og:title", content: "Vagas de emprego — portalvagas" },
      { property: "og:description", content: "Todas as vagas abertas em Moçambique." },
    ],
  }),
  component: Vagas,
});

function Vagas() {
  const s = Route.useSearch();
  const { data: jobs } = useSuspenseQuery(jobsQuery);
  const list = jobs.filter(
    (j) =>
      (!s.q || (j.title + j.company).toLowerCase().includes(s.q.toLowerCase())) &&
      (!s.local || j.location === s.local) &&
      (!s.area || j.area === s.area),
  );
  return (
    <>
      <Header />
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mb-6 font-display text-4xl font-extrabold">Vagas de emprego</h1>
          <SearchBar key={JSON.stringify(s)} initial={s} areas={areasOf(jobs)} />
        </div>
      </section>
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <p className="mb-4 text-sm text-muted-foreground"><strong>{list.length}</strong> vagas encontradas</p>
        <div className="grid gap-3">
          {list.map((j) => <JobCard key={j.id} job={j} />)}
          {!list.length && <p className="py-10 text-center text-muted-foreground">Nenhuma vaga encontrada.</p>}
        </div>
      </section>
      <Footer />
    </>
  );
}
