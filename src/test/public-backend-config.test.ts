import { describe, expect, it } from "vitest";
import { resolvePublicBackendConfig } from "@/lib/public-backend-config";

describe("Public backend environment", () => {
  it("prefers runtime bindings to build-time configuration", () => {
    expect(resolvePublicBackendConfig({ SUPABASE_URL: "https://runtime.example", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_runtime", VITE_SUPABASE_URL: "https://build.example", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_build" })).toEqual({ url: "https://runtime.example", key: "sb_publishable_runtime" });
  });
  it("uses public build values when runtime bindings are absent", () => {
    expect(resolvePublicBackendConfig({ VITE_SUPABASE_URL: "https://build.example", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_build" })).toEqual({ url: "https://build.example", key: "sb_publishable_build" });
  });
  it("supports the legacy runtime anon key", () => {
    expect(resolvePublicBackendConfig({ SUPABASE_URL: "https://runtime.example", SUPABASE_ANON_KEY: "legacy-anon-key" }).key).toBe("legacy-anon-key");
  });
  it("reports a missing URL before constructing the client", () => {
    expect(() => resolvePublicBackendConfig({ SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" })).toThrow("SUPABASE_URL or VITE_SUPABASE_URL");
  });
  it("reports a missing public key before constructing the client", () => {
    expect(() => resolvePublicBackendConfig({ SUPABASE_URL: "https://runtime.example" })).toThrow("SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY");
  });
  it("rejects non-HTTP URLs", () => {
    expect(() => resolvePublicBackendConfig({ SUPABASE_URL: "file:///tmp/backend", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" })).toThrow("absolute HTTP(S)");
  });
  it("rejects secret keys for public reads", () => {
    expect(() => resolvePublicBackendConfig({ SUPABASE_URL: "https://runtime.example", SUPABASE_PUBLISHABLE_KEY: "sb_secret_test" })).toThrow("not a secret key");
  });
});