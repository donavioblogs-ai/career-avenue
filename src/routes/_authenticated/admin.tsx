import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Briefcase, Settings, LogOut, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Painel — PortalVagas" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });
  async function logout() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }
  const item = "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary";
  const active = { className: "bg-secondary font-semibold text-primary" };
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r bg-card p-4">
        <p className="mb-6 font-display text-xl font-extrabold text-primary">Painel</p>
        <nav className="space-y-1">
          <Link to="/admin" activeOptions={{ exact: true }} activeProps={active} className={item}><LayoutDashboard className="h-4 w-4" />Visão geral</Link>
          <Link to="/admin/vagas" activeProps={active} className={item}><Briefcase className="h-4 w-4" />Vagas</Link>
          <Link to="/admin/configuracoes" activeProps={active} className={item}><Settings className="h-4 w-4" />Configurações</Link>
          <Link to="/" className={item}><Globe className="h-4 w-4" />Ver site</Link>
          <button onClick={logout} className={item + " w-full"}><LogOut className="h-4 w-4" />Sair</button>
        </nav>
        <p className="mt-8 truncate text-xs text-muted-foreground">{user.email}</p>
      </aside>
      <main className="flex-1 p-8">
        {isLoading ? <p>A carregar…</p> : isAdmin ? <Outlet /> : (
          <div className="rounded-xl border bg-card p-8">
            <h1 className="text-xl font-bold">Sem acesso</h1>
            <p className="mt-2 text-muted-foreground">A sua conta não tem permissão de administrador.</p>
          </div>
        )}
      </main>
    </div>
  );
}
