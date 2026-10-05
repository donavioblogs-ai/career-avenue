import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header, Footer } from "@/components/site";
import { JOBS } from "@/lib/jobs";

export const Route = createFileRoute("/vagas/$slug")({
  loader: ({ params }) => {
    const job = JOBS.find((j) => j.slug === params.slug);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Vaga não encontrada" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.job.title} — portalvagas`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.job.description },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.job.description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { job } = Route.useLoaderData();
  const rows = [["Empresa", job.company], ["Local", job.location], ["Tipo", job.type], ["Área", job.area], ["Salário", job.salary ?? "Não divulgado"], ["Publicada", job.posted], ["Prazo", job.deadline]];
  return (
    <>
      <Header />
      <div className="mx-auto mt-10 grid max-w-6xl gap-8 px-4 md:grid-cols-[2fr_1fr]">
        <article>
          <Link to="/vagas" search={{}} className="text-sm text-primary hover:underline">← Voltar às vagas</Link>
          <p className="mt-4 text-muted-foreground">{job.company}</p>
          <h1 className="font-display text-3xl font-extrabold">{job.title}</h1>
          <h2 className="mt-8 text-lg font-bold">Descrição da vaga</h2>
          <p className="mt-2 leading-relaxed">{job.description}</p>
          <h2 className="mt-6 text-lg font-bold">Como candidatar-se</h2>
          <p className="mt-2 leading-relaxed">Envie o seu CV e carta de motivação antes de {job.deadline}, indicando o título da vaga no assunto.</p>
        </article>
        <aside className="h-fit rounded-xl border bg-card p-5">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b py-2 text-sm last:border-0">
              <span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span>
            </div>
          ))}
          <button className="mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground">Candidatar-se</button>
        </aside>
      </div>
      <Footer />
    </>
  );
}
