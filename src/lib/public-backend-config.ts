type PublicBackendEnvironment = {
  SUPABASE_URL?: string | undefined;
  SUPABASE_PUBLISHABLE_KEY?: string | undefined;
  SUPABASE_ANON_KEY?: string | undefined;
  VITE_SUPABASE_URL?: string | undefined;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string | undefined;
  VITE_SUPABASE_ANON_KEY?: string | undefined;
};

// Pure validation only: callers read runtime environment inside server handlers.
export function resolvePublicBackendConfig(env: PublicBackendEnvironment) {
  const url = env.SUPABASE_URL?.trim() || env.VITE_SUPABASE_URL?.trim();
  const key = env.SUPABASE_PUBLISHABLE_KEY?.trim() || env.SUPABASE_ANON_KEY?.trim()
    || env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || env.VITE_SUPABASE_ANON_KEY?.trim();
  const missing = [
    ...(!url ? ["SUPABASE_URL or VITE_SUPABASE_URL"] : []),
    ...(!key ? ["SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY"] : []),
  ];
  if (!url || !key) {
    throw new Error(`PortalVagas: missing public backend configuration: ${missing.join(", ")}. Set build-time VITE_* variables and runtime SUPABASE_* bindings before deploying.`);
  }
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error("PortalVagas: backend URL must be an absolute HTTP(S) URL."); }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("PortalVagas: backend URL must be an absolute HTTP(S) URL.");
  }
  if (key.startsWith("sb_secret_")) {
    throw new Error("PortalVagas: public reads require a publishable key, not a secret key.");
  }
  return { url, key };
}