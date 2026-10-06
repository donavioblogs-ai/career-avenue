import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header, Footer } from "@/components/site";
import { getJob, registerView } from "@/lib/public.functions";
import { fmtDate, timeAgo } from "@/lib/jobs";

export const Route = createFileRoute("/vagas/$slug")({
  staticData: { sitemap: true },
  loader: async ({ params }) => {
    const job = await getJob({ data: { slug: params.slug } });
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Vaga não encontrada" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.job.title} — portalvagas`;
    const j = loaderData.job;
    const d = j.description.slice(0, 160);
    const typeMap: Record<string, string> = { "Tempo inteiro": "FULL_TIME", "Full-time": "FULL_TIME", "Tempo parcial": "PART_TIME", "Estágio": "INTERN", "Consultoria": "CONTRACTOR", "Voluntariado": "VOLUNTEER" };
    const url = `https://career-avenue.lovable.app/vagas/${j.slug}`;
    const ld: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: j.title,
      description: j.description,
      datePosted: j.created_at,
      hiringOrganization: { "@type": "Organization", name: j.company, ...(j.company_logo ? { logo: j.company_logo } : {}) },
      jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressRegion: j.location, addressCountry: "MZ" } },
      ...(typeMap[j.type] ? { employmentType: typeMap[j.type] } : {}),
      ...(j.deadline ? { validThrough: `${j.deadline}T23:59:59` } : {}),
      url,
    };
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }],
    };
  },
  notFoundComponent: () => (
    <><Header /><p className="py-20 text-center">Vaga não encontrada. <Link to="/vagas" search={{}} className="text-primary underline">Ver vagas</Link></p></>
  ),
  errorComponent: () => <p className="py-20 text-center">Erro ao carregar a vaga.</p>,
  component: Detail,
});

function Detail() {
  const { job } = Route.useLoaderData();
  useEffect(() => { registerView({ data: { slug: job.slug } }); }, [job.slug]);
  const rows: [string, string][] = [["Empresa", job.company], ["Local", job.location], ["Tipo", job.type], ["Área", job.area], ["Salário", job.salary ?? "Não divulgado"], ["Publicada", timeAgo(job.created_at)], ["Prazo", fmtDate(job.deadline)]];
  return (
    <>
      <Header />
      <div className="mx-auto mt-10 grid max-w-6xl gap-8 px-4 md:grid-cols-[2fr_1fr]">
        <article>
          <Link to="/vagas" search={{}} className="text-sm text-primary hover:underline">← Voltar às vagas</Link>
          <p className="mt-4 text-muted-foreground">{job.company}</p>
          <h1 className="font-display text-3xl font-extrabold">{job.title}</h1>
          <h2 className="mt-8 text-lg font-bold">Descrição da vaga</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed">{job.description}</p>
          {job.how_to_apply && (<><h2 className="mt-6 text-lg font-bold">Como candidatar-se</h2><p className="mt-2 whitespace-pre-line leading-relaxed">{job.how_to_apply}</p></>)}
        </article>
        <aside className="h-fit rounded-xl border bg-card p-5">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b py-2 text-sm last:border-0">
              <span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span>
            </div>
          ))}
          {job.apply_url && (
            <a href={job.apply_url} target="_blank" rel="noreferrer" className="mt-4 block w-full rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground">Candidatar-se</a>
          )}
        </aside>
      </div>
      <Footer />
    </>
  );
}
