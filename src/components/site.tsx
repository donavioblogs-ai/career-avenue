import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MapPin, Clock, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, timeAgo, fmtDate, type Job } from "@/lib/jobs";
import { Button } from "@/components/ui/button";

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
  const { data: s } = useSuspenseQuery(settingsQuery);
  const name = s?.site_name?.toLowerCase() === "portalvagas" ? "PortalVagas" : s?.site_name || "PortalVagas";
  return (
    <header className="border-b bg-card">
      <div className="site-header mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="font-display text-2xl font-extrabold text-primary">{name}</Link>
        <nav aria-label="Navegação principal" className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Início</Link>
          <Link to="/vagas" search={{}} activeProps={{ className: "text-primary" }}>Vagas de emprego</Link>
          <Button asChild variant="outline"><Link to={signedIn ? "/admin" : "/auth"}>
            {signedIn ? "Painel" : "Entrar"}
          </Link></Button>
          <Button asChild className="hidden sm:inline-flex"><Link to={signedIn ? "/admin/vagas" : "/auth"}>Publicar vaga</Link></Button>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  return (
    <footer className="mt-20 bg-hero text-hero-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <p className="font-display text-xl font-extrabold">{s?.site_name?.toLowerCase() === "portalvagas" ? "PortalVagas" : s?.site_name || "PortalVagas"}</p>
        <p className="mt-2 opacity-80">{s?.footer_text}</p>
        {s?.contact_email && <p className="mt-2 opacity-80">Contacto: {s.contact_email}</p>}
        <p className="mt-6 opacity-60">© {new Date().getFullYear()} {s?.site_name?.toLowerCase() === "portalvagas" ? "PortalVagas" : s?.site_name || "PortalVagas"}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="job-row">
      {job.company_logo ? (
        <img src={job.company_logo} alt={job.company} className="job-logo" loading="lazy" />
      ) : (
        <div className="job-logo flex items-center justify-center bg-secondary font-display text-lg font-bold text-primary">
          {job.company.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{job.company}</p>
        <h3 className="mt-1 text-base font-bold leading-snug hover:text-primary">
          <Link to="/vagas/$slug" params={{ slug: job.slug }}>{job.title}</Link>
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.area}</span>
          {job.salary && <span className="font-medium text-foreground">{job.salary}</span>}
        </div>
      </div>
      <div className="job-dates text-xs leading-6 text-muted-foreground">
        <p>{timeAgo(job.created_at)}</p>
        {job.deadline && <p className="font-medium text-destructive">Termina {fmtDate(job.deadline)}</p>}
      </div>
    </article>
  );
}
