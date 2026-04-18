-- ====================================
-- Samuel Formation — Schéma Supabase
-- ====================================

-- Profils utilisateurs (liés à auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  email       text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Catégories
create table if not exists public.categories (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  slug        text unique not null,
  description text,
  image_url   text,
  created_at  timestamptz default now()
);

-- Formations
create table if not exists public.courses (
  id            uuid default gen_random_uuid() primary key,
  title         text not null,
  slug          text unique not null,
  description   text,
  price         numeric(10, 2) not null default 0,
  category_id   uuid references public.categories(id) on delete set null,
  thumbnail_url text,
  is_published  boolean default false,
  created_at    timestamptz default now()
);

-- Vidéos
create table if not exists public.videos (
  id                  uuid default gen_random_uuid() primary key,
  title               text not null,
  course_id           uuid references public.courses(id) on delete cascade,
  cloudinary_url      text,
  cloudinary_public_id text,
  duration            integer default 0,
  order_index         integer default 0,
  created_at          timestamptz default now()
);

-- Achats / Accès
create table if not exists public.purchases (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users(id) on delete cascade,
  course_id      uuid references public.courses(id) on delete cascade,
  amount         numeric(10, 2) not null,
  transaction_id text unique,
  status         text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at     timestamptz default now(),
  unique (user_id, course_id)
);

-- =====================
-- Row Level Security
-- =====================

alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.courses    enable row level security;
alter table public.videos     enable row level security;
alter table public.purchases  enable row level security;

-- Profiles : lecture par le propriétaire + admins
create policy "Profil visible par propriétaire" on public.profiles
  for select using (auth.uid() = id);
create policy "Profil modifiable par propriétaire" on public.profiles
  for update using (auth.uid() = id);

-- Catégories : lecture publique, écriture admin
create policy "Catégories publiques" on public.categories
  for select using (true);
create policy "Catégories admin" on public.categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Formations : lecture publique (publiées), écriture admin
create policy "Formations publiées publiques" on public.courses
  for select using (is_published = true or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Formations admin" on public.courses
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Vidéos : accès si acheté ou admin
create policy "Vidéos accessibles si achat" on public.videos
  for select using (
    exists (
      select 1 from public.purchases p
      where p.course_id = videos.course_id
        and p.user_id = auth.uid()
        and p.status = 'completed'
    ) or
    exists (
      select 1 from public.courses c
      where c.id = videos.course_id and c.price = 0
    ) or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Vidéos admin" on public.videos
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Achats : visible par acheteur + admin
create policy "Achats visibles par acheteur" on public.purchases
  for select using (user_id = auth.uid() or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Créer un achat" on public.purchases
  for insert with check (user_id = auth.uid());
create policy "Modifier achat" on public.purchases
  for update using (
    user_id = auth.uid() or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================
-- Données de test
-- =====================

-- Pour définir un utilisateur admin, exécutez dans SQL Editor :
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'votre@email.com';
