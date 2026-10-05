create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- first user becomes admin
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id,'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  company text not null,
  company_logo text,
  location text not null,
  type text not null default 'Tempo inteiro',
  area text not null,
  salary text,
  deadline date,
  description text not null default '',
  how_to_apply text not null default '',
  apply_url text,
  published boolean not null default true,
  views integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.jobs to anon, authenticated; grant insert, update, delete on public.jobs to authenticated; grant all on public.jobs to service_role;
alter table public.jobs enable row level security;
create policy "public read published" on public.jobs for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin insert" on public.jobs for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.jobs for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.jobs for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.increment_job_view(_slug text) returns void language sql security definer set search_path=public as $$ update public.jobs set views = views + 1 where slug=_slug and published $$;
grant execute on function public.increment_job_view(text) to anon, authenticated;

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'portalvagas',
  hero_title text not null default 'O seu próximo emprego está a um clique.',
  hero_subtitle text not null default 'Reunimos todos os dias vagas de emprego, estágios e consultorias em Moçambique e no resto do mundo.',
  footer_text text not null default 'Vagas de emprego, estágios e consultorias em Moçambique e no mundo.',
  contact_email text
);
grant select on public.site_settings to anon, authenticated; grant update on public.site_settings to authenticated; grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin update settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(),'admin'));
insert into public.site_settings(id) values (1);

insert into public.jobs (slug,title,company,location,type,area,salary,deadline,description,how_to_apply) values
('tecnico-help-desk-ti-maputo','Técnico de Help Desk de TI, Maputo, Moçambique','FNB Moçambique','Maputo Cidade','Tempo inteiro','Redes, Infraestrutura e Sistemas',null,'2026-10-11','Prestar suporte técnico aos utilizadores, gerir incidentes e manter a infraestrutura de TI do banco.','Envie o seu CV e carta de motivação indicando o título da vaga.'),
('technical-officer-emce-rcce-maputo','Technical Officer for Public Health Messaging and Community Engagement, Maputo','FHI 360','Maputo Cidade','Full-time','Community Engagement','USD 34,000 – 43,000 / ano','2026-10-10','Lead evidence-based risk communication and community engagement activities.','Apply online with your CV.'),
('senior-technical-officer-health-emergency','Senior Technical Officer – Health Emergency Management, Maputo','FHI 360','Maputo Cidade','Full-time','Health Emergency Management','USD 47,500 – 57,000 / ano','2026-10-10','Provide technical leadership on health emergency preparedness and response.','Apply online with your CV.'),
('coordenador-monitoria-ecologica-massale','Coordenador(a) de Monitoria Ecológica, Massale, Matutuíne','FDSC / Conserve Global','Maputo Província','Tempo inteiro','Conservação e Gestão Ambiental',null,'2026-10-16','Coordenar programas de monitoria ecológica e recolha de dados de biodiversidade.','Envie o seu CV por email.'),
('oficial-qualidade-cuidados-niassa','Oficial de Qualidade de Cuidados, Niassa, Moçambique','PSI Moçambique','Niassa','Tempo inteiro','Nível médio em Saúde',null,'2026-10-07','Garantir a qualidade dos serviços de saúde prestados nas unidades sanitárias apoiadas.','Envie o seu CV por email.'),
('oficial-logistica-cabo-delgado','Oficial de Logística, Pemba, Cabo Delgado','Ação Contra a Fome','Cabo Delgado','Tempo inteiro','Logística',null,'2026-10-14','Gerir aprovisionamento, armazém e frota para operações humanitárias.','Candidate-se online.'),
('contabilista-beira','Contabilista Sénior, Beira, Sofala','Grupo Sofala','Sofala','Tempo inteiro','Contabilidade',null,'2026-10-20','Elaborar demonstrações financeiras e assegurar o cumprimento fiscal.','Envie o seu CV por email.'),
('estagio-engenharia-software-nampula','Estágio em Engenharia de Software, Nampula','TechMoz','Nampula','Estágio','Engenharia de Software',null,'2026-10-25','Participar no desenvolvimento de aplicações web e móveis.','Envie o seu CV e portfólio.');