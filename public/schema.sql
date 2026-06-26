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