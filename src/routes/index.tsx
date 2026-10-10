import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Briefcase, Mail } from "lucide-react";
import { Header, Footer, JobCard, useSession } from "@/components/site";
import { jobsQuery, settingsQuery, areasOf } from "@/lib/jobs";
import { SearchBar } from "@/components/job-search";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(jobsQuery), context.queryClient.ensureQueryData(settingsQuery)]),
  head: () => ({
    meta: [
      { title: "PortalVagas — Vagas de emprego em Moçambique" },
      { name: "description", content: "Vagas de emprego, estágios e consultorias em Moçambique e no resto do mundo, actualizadas diariamente." },
      { property: "og:title", content: "PortalVagas — Vagas de emprego em Moçambique" },
      { property: "og:description", content: "O seu próximo emprego está a um clique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: jobs } = useSuspenseQuery(jobsQuery);
  const { data: s } = useSuspenseQuery(settingsQuery);
  const areas = areasOf(jobs);
  const signedIn = useSession();
  const topAreas = areas.map((area) => ({ area, count: jobs.filter((job) => job.area === area).length })).sort((a, b) => b.count - a.count).slice(0, 8);
  const stats: [string | number, string][] = [
    [jobs.length, "Vagas abertas"],
    [areas.length, "Áreas profissionais"],
    [new Set(jobs.map((j) => j.location)).size, "Locais cobertos"],
    ["24h", "Actualização diária"],
  ];
  return (
    <>
      <Header />
      <main>
      <section className="home-hero bg-hero text-hero-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:pt-16">
          <p className="vacancy-status"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" /><strong>{jobs.length}</strong> vagas abertas agora</p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-tight md:text-5xl">{s?.hero_title}</h1>
          <p className="mt-5 max-w-xl leading-7 text-hero-muted">{s?.hero_subtitle}</p>
          <div className="mt-8"><SearchBar areas={areas} /></div>
        </div>
      </section>
      <section aria-label="PortalVagas em números" className="stats-strip mx-auto -mt-8 grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {stats.map(([n, l]) => (
          <div key={l} className="px-6 py-6 md:px-8">
            <p className="font-display text-3xl font-extrabold">{n}</p>
            <p className="mt-2 text-xs text-muted-foreground">{l}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Publicadas recentemente</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold">Vagas de emprego</h2>
            <p className="text-muted-foreground">As oportunidades mais recentes, verificadas antes de irem para o ar.</p>
          </div>
          <Link to="/vagas" search={{}} className="text-sm font-semibold text-primary hover:underline">Ver todas →</Link>
        </div>
        <div className="job-list mt-6">
          {jobs.slice(0, 12).map((j) => <JobCard key={j.id} job={j} />)}
          {!jobs.length && <p className="py-10 text-center text-muted-foreground">Ainda não há vagas publicadas.</p>}
        </div>
        <div className="mt-8 text-center"><Button asChild variant="outline" size="lg"><Link to="/vagas" search={{}}>Ver mais vagas <ArrowRight /></Link></Button>{jobs.length > 12 && <p className="mt-3 text-sm text-muted-foreground">Mais {jobs.length - 12} vagas à sua espera</p>}</div>
      </section>
      {topAreas.length > 0 && <section className="mt-16 border-y bg-muted/40 py-14"><div className="mx-auto max-w-6xl px-4"><p className="section-eyebrow">Por onde começar</p><h2 className="mt-2 font-display text-3xl font-extrabold">Áreas com mais procura</h2><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{topAreas.map(({ area, count }) => <Link key={area} to="/vagas" search={{ area }} className="flex min-w-0 items-start gap-3 rounded-lg border bg-card p-5 transition-colors hover:border-primary"><Briefcase className="mt-1 h-5 w-5 shrink-0 text-primary" /><span className="min-w-0"><strong className="block break-words text-sm">{area}</strong><span className="mt-2 block text-xs text-muted-foreground">{count} {count === 1 ? "vaga aberta" : "vagas abertas"}</span></span></Link>)}</div></div></section>}
      <section className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-14"><div className="max-w-xl"><p className="section-eyebrow">Para quem recruta</p><h2 className="mt-2 font-display text-3xl font-extrabold">Publique a sua vaga no PortalVagas.</h2></div><Button asChild size="lg"><Link to={signedIn ? "/admin/vagas" : "/auth"}>Publicar vaga <ArrowRight /></Link></Button></section>
      {s?.contact_email && <section className="border-t"><div className="mx-auto max-w-6xl px-4 pt-12"><p className="section-eyebrow">Estamos por perto</p><h2 className="mt-2 font-display text-3xl font-extrabold">Alguma dúvida? Fale connosco.</h2><Button asChild variant="outline" className="mt-6"><a href={`mailto:${s.contact_email}`}><Mail /> Fale connosco</a></Button></div></section>}
      </main>
      <Footer />
    </>
  );
}
