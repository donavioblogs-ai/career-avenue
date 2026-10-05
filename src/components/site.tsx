import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Briefcase } from "lucide-react";
import type { Job } from "@/lib/jobs";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-2xl font-extrabold text-primary">
          portal<span className="text-accent-foreground">vagas</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Início</Link>
          <Link to="/vagas" search={{}} activeProps={{ className: "text-primary" }}>Vagas de emprego</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <p className="font-display text-xl font-extrabold">portalvagas</p>
        <p className="mt-2 opacity-80">Vagas de emprego, estágios e consultorias em Moçambique e no mundo.</p>
        <p className="mt-6 opacity-60">© {new Date().getFullYear()} portalvagas. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-lg font-bold text-primary">
        {job.company.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{job.company}</p>
        <h3 className="font-semibold hover:text-primary">
          <Link to="/vagas/$slug" params={{ slug: job.slug }}>{job.title}</Link>
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.area}</span>
          {job.salary && <span className="font-medium text-foreground">{job.salary}</span>}
        </div>
      </div>
      <div className="text-xs text-muted-foreground sm:text-right">
        <p>{job.posted}</p>
        <p className="font-medium text-destructive">Termina {job.deadline}</p>
      </div>
    </article>
  );
}
