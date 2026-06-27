create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  first_name text not null,
  middle_name text,
  last_name text not null,

  email text unique not null,

  role text not null check (role in ('admin', 'scholar')),

  must_change_password boolean default true,

  is_active boolean default true,

  created_at timestamp default now(),
  updated_at timestamp default now()
);


create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);



create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Admins full access"
on public.profiles
for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);


drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);


create policy "Admins full access"
on public.profiles
for all
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);