import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MapPin, Clock, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, timeAgo, fmtDate, type Job } from "@/lib/jobs";

export function useSession() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);
  return signedIn;
}

export function Header() {
  const signedIn = useSession();
  const { data: s } = useQuery(settingsQuery);
  const name = s?.site_name ?? "portalvagas";
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-2xl font-extrabold text-primary">{name}</Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Início</Link>
          <Link to="/vagas" search={{}} activeProps={{ className: "text-primary" }}>Vagas de emprego</Link>
          <Link to={signedIn ? "/admin" : "/auth"} className="rounded-md border px-3 py-1.5 hover:border-primary">
            {signedIn ? "Painel" : "Entrar"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const { data: s } = useQuery(settingsQuery);
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <p className="font-display text-xl font-extrabold">{s?.site_name ?? "portalvagas"}</p>
        <p className="mt-2 opacity-80">{s?.footer_text}</p>
        {s?.contact_email && <p className="mt-2 opacity-80">Contacto: {s.contact_email}</p>}
        <p className="mt-6 opacity-60">© {new Date().getFullYear()} {s?.site_name ?? "portalvagas"}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-md sm:flex-row sm:items-center">
      {job.company_logo ? (
        <img src={job.company_logo} alt={job.company} className="h-14 w-14 shrink-0 rounded-lg border object-contain p-1" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-lg font-bold text-primary">
          {job.company.slice(0, 2).toUpperCase()}
        </div>
      )}
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
        <p>{timeAgo(job.created_at)}</p>
        {job.deadline && <p className="font-medium text-destructive">Termina {fmtDate(job.deadline)}</p>}
      </div>
    </article>
  );
}
