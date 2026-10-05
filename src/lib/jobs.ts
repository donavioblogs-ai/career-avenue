import { queryOptions } from "@tanstack/react-query";
import { listJobs, getSettings } from "./public.functions";

export type Job = Awaited<ReturnType<typeof listJobs>>[number];

export const LOCATIONS = ["Cabo Delgado", "Gaza", "Inhambane", "Manica", "Maputo Cidade", "Maputo Província", "Nampula", "Niassa", "Sofala", "Tete", "Todo o país", "Zambézia", "Internacional"];
export const TYPES = ["Tempo inteiro", "Tempo parcial", "Estágio", "Consultoria", "Full-time", "Voluntariado"];

export const jobsQuery = queryOptions({ queryKey: ["jobs"], queryFn: () => listJobs() });
export const settingsQuery = queryOptions({ queryKey: ["settings"], queryFn: () => getSettings() });

export const areasOf = (jobs: Job[]) => Array.from(new Set(jobs.map((j) => j.area))).sort();

export function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? "Hoje" : d === 1 ? "1 dia atrás" : `${d} dias atrás`;
}
export function fmtDate(d: string | null) {
  return d ? new Date(d + "T00:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "short" }) : "—";
}
export function slugify(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
