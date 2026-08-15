create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text,
  phone text, 
  age int check (age is null or age >= 16),
  height_cm numeric check (height_cm is null or height_cm > 0),
  units text not null default 'imperial' check (units in ('imperial','metric')),
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_goals (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, goal_type text not null, target_value numeric, metadata jsonb not null default '{}', created_at timestamptz not null default now());
create table public.health_metrics (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, recorded_on date not null, metric_type text not null, value numeric not null, unit text not null, source text not null default 'manual', created_at timestamptz not null default now(), unique(user_id, recorded_on, metric_type));
create table public.weight_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, recorded_on date not null, weight_kg numeric not null check(weight_kg > 0), note text, created_at timestamptz not null default now(), unique(user_id, recorded_on));
create table public.nutrition_preferences (user_id uuid primary key references auth.users(id) on delete cascade, diet text, allergies text[] not null default '{}', foods_liked text[] not null default '{}', foods_disliked text[] not null default '{}', cuisines_liked text[] not null default '{}', updated_at timestamptz not null default now());
create table public.food_items (id uuid primary key default gen_random_uuid(), name text not null, ingredients text[] not null default '{}', allergens text[] not null default '{}', diet_tags text[] not null default '{}', nutrition jsonb not null default '{}', is_active boolean not null default true, created_at timestamptz not null default now());
create table public.meal_recommendations (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, food_item_id uuid references public.food_items(id) on delete set null, title text not null, category text not null, rationale text, ingredients text[] not null default '{}', tags text[] not null default '{}', generated_at timestamptz not null default now());
create table public.saved_meals (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, recommendation_id uuid references public.meal_recommendations(id) on delete cascade, feedback text check(feedback is null or feedback in ('favorite','saved','disliked')), created_at timestamptz not null default now());
create table public.meal_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, recommendation_id uuid references public.meal_recommendations(id) on delete set null, eaten_at timestamptz not null default now(), servings numeric not null default 1, note text);
create table public.workouts (id uuid primary key default gen_random_uuid(), title text not null, category text not null, duration_minutes int not null, level text not null, equipment text[] not null default '{}', exercises jsonb not null default '[]', is_public boolean not null default true, created_at timestamptz not null default now());
create table public.workout_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, workout_id uuid references public.workouts(id) on delete set null, title text not null, performed_on date not null, minutes int not null check(minutes >= 0), metadata jsonb not null default '{}', created_at timestamptz not null default now());
create table public.recovery_profiles (user_id uuid primary key references auth.users(id) on delete cascade, enabled boolean not null default false, start_date date, category text, goal text, motivation text, trusted_contact_encrypted text, coping_strategies text[] not null default '{}', updated_at timestamptz not null default now());
create table public.recovery_checkins (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, checkin_date date not null, status text not null check(status in ('met','difficult','lapse','unlogged')), mood smallint check(mood between 1 and 5), craving smallint check(craving between 1 and 5), triggers text[] not null default '{}', strategies text[] not null default '{}', note text, created_at timestamptz not null default now(), unique(user_id, checkin_date));
create table public.craving_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, logged_at timestamptz not null default now(), intensity smallint check(intensity between 1 and 5), triggers text[] not null default '{}', strategy_used text, reassessed_intensity smallint check(reassessed_intensity between 1 and 5), note text);
create table public.mood_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, recorded_on date not null, mood smallint not null check(mood between 1 and 5), stress smallint check(stress between 1 and 5), tags text[] not null default '{}', created_at timestamptz not null default now(), unique(user_id, recorded_on));
create table public.sleep_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, sleep_date date not null, hours numeric check(hours between 0 and 24), quality smallint check(quality between 1 and 5), note text, unique(user_id, sleep_date));
create table public.water_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, recorded_on date not null, milliliters int not null check(milliliters >= 0), unique(user_id, recorded_on));
create table public.journal_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, entry_type text not null default 'reflection', body text not null, tags text[] not null default '{}', created_at timestamptz not null default now());
create table public.achievements (id uuid primary key default gen_random_uuid(), code text unique not null, title text not null, description text not null, category text not null, threshold numeric);
create table public.user_achievements (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, achievement_id uuid not null references public.achievements(id) on delete cascade, earned_at timestamptz not null default now(), unique(user_id, achievement_id));
create table public.notification_preferences (user_id uuid primary key references auth.users(id) on delete cascade, private_text boolean not null default true, milestones boolean not null default false, daily_reminder boolean not null default false, reminder_time time, updated_at timestamptz not null default now());

do $$ declare t text; begin foreach t in array array['profiles','user_goals','health_metrics','weight_entries','nutrition_preferences','meal_recommendations','saved_meals','meal_logs','workout_logs','recovery_profiles','recovery_checkins','craving_logs','mood_entries','sleep_entries','water_entries','journal_entries','user_achievements','notification_preferences'] loop execute format('alter table public.%I enable row level security', t); if t = 'profiles' then execute format('create policy "own rows" on public.%I for all using (id = auth.uid()) with check (id = auth.uid())', t); else execute format('create policy "own rows" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t); end if; end loop; end $$;
alter table public.food_items enable row level security;
alter table public.workouts enable row level security;
alter table public.achievements enable row level security;
create policy "catalog read" on public.food_items for select using (is_active);
create policy "workout catalog read" on public.workouts for select using (is_public);
create policy "achievement catalog read" on public.achievements for select using (true);

create or replace function public.create_profile_for_new_user() returns trigger language plpgsql security definer set search_path = '' as $$ begin insert into public.profiles(id,email,first_name) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'first_name','')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_profile_for_new_user();

