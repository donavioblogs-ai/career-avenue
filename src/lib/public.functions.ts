import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function pub() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const COLS = "id, slug, title, company, company_logo, location, type, area, salary, deadline, description, how_to_apply, apply_url, created_at";

export const listJobs = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await pub().from("jobs").select(COLS).eq("published", true).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getJob = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { data: job } = await pub().from("jobs").select(COLS).eq("slug", data.slug).eq("published", true).maybeSingle();
    return job;
  });

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await pub().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data;
});

export const registerView = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    await pub().rpc("increment_job_view", { _slug: data.slug });
    return { ok: true };
  });
