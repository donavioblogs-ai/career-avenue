<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public pages read jobs/settings through public server functions (src/lib/public.functions.ts) with the publishable key; the admin panel under src/routes/_authenticated/admin* writes via the browser client, protected by RLS + has_role('admin'). Why: SSR-safe public reads, permissions enforced in the database.
- The first account to sign up automatically becomes admin (DB trigger). Why: bootstraps the panel without manual role setup.
- Keep the shared job search in a browser-safe component and use the shared job row on both public listings. Why: avoids importing route modules and keeps list presentation consistent.
