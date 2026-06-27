create table public.scholar_profiles (
  id uuid primary key default gen_random_uuid(),

  -- LINK TO AUTH PROFILE (1:1)
  profile_id uuid not null unique
    references public.profiles(id)
    on delete cascade,

  -- SCHOOL IDENTIFIER
  student_code text unique,

  -- BASIC INFO
  gender text,
  birthdate date,
  birthplace text,

  -- ACADEMIC INFO
  course text,
  year_level text,
  school_name text,
  school_location text,

  -- OPTIONAL PROFILE DATA
  dialect text,
  hobbies text,
  area text,

  -- STATUS (IMPORTANT FOR DASHBOARD)
  is_active boolean default true,
  is_irregular boolean default false,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- FAST JOIN TO PROFILES
create index idx_scholar_profile_id
on public.scholar_profiles(profile_id);

-- FAST FILTER ACTIVE SCHOLARS
create index idx_scholar_active
on public.scholar_profiles(is_active);

-- FAST DASHBOARD FILTERING
create index idx_scholar_course_year
on public.scholar_profiles(course, year_level);

-- FAST SEARCH (student code lookup)
create index idx_scholar_student_code
on public.scholar_profiles(student_code);




create or replace function public.create_scholar_profile()
returns trigger
language plpgsql
as $$
begin
  if new.role = 'scholar' then
    insert into public.scholar_profiles(profile_id)
    values (new.id);
  end if;

  return new;
end;
$$;

create trigger trg_create_scholar_profile
after insert on public.profiles
for each row
execute function public.create_scholar_profile();






==============================================================================================================
create policy "profiles_select_policy"
on public.profiles
for select
using (
  auth.uid() = id
  OR
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

create policy "profiles_update_policy"
on public.profiles
for update
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
);

create policy "profiles_insert_policy"
on public.profiles
for insert
with check (
  auth.uid() = id
);

create policy "profiles_delete_policy"
on public.profiles
for delete
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);