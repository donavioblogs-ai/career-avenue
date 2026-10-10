import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, MapPin, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOCATIONS } from "@/lib/jobs";

type InitialSearch = { q?: string; local?: string; area?: string };

export function SearchBar({ initial, areas }: { initial?: InitialSearch; areas: string[] }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initial?.q ?? "");
  const [local, setLocal] = useState(initial?.local ?? "");
  const [area, setArea] = useState(initial?.area ?? "");
  return (
    <form className="job-search" onSubmit={(event) => {
      event.preventDefault();
      navigate({ to: "/vagas", search: { q: q || undefined, local: local || undefined, area: area || undefined } });
    }}>
      <label className="search-field"><Search aria-hidden="true" /><span><span className="search-label">O que procura</span><input aria-label="O que procura" placeholder="Cargo, empresa ou palavra-chave" value={q} onChange={(event) => setQ(event.target.value)} /></span></label>
      <label className="search-field"><MapPin aria-hidden="true" /><span><span className="search-label">Onde</span><select aria-label="Local" value={local} onChange={(event) => setLocal(event.target.value)}><option value="">Qualquer local</option>{LOCATIONS.map((location) => <option key={location}>{location}</option>)}</select></span></label>
      <label className="search-field"><LayoutGrid aria-hidden="true" /><span><span className="search-label">Área profissional</span><select aria-label="Área profissional" value={area} onChange={(event) => setArea(event.target.value)}><option value="">Todas as áreas</option>{areas.map((item) => <option key={item}>{item}</option>)}</select></span></label>
      <Button type="submit" className="h-12 px-6">Pesquisar <ArrowRight /></Button>
    </form>
  );
}