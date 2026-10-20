create extension if not exists pgcrypto;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  practice_name text not null,
  practice_type text not null,
  locations text not null default '1',
  phone text,
  challenge text,
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  status text not null default 'new' check (status in ('new', 'reviewing', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.applications add column if not exists marketing_consent boolean not null default false;
alter table public.applications add column if not exists marketing_consent_at timestamptz;

create table if not exists public.marketing_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  country text not null check (country in ('US', 'UK', 'ZA')),
  practice_type text not null check (practice_type in ('Medical', 'Dental', 'Med spa', 'Other')),
  consent_source text not null,
  consented_at timestamptz not null,
  brevo_sync_status text not null default 'pending' check (brevo_sync_status in ('pending', 'synced', 'failed')),
  synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.practices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  practice_type text not null,
  timezone text not null default 'UTC',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  paypal_subscription_id text not null unique,
  practice_id uuid references public.practices(id) on delete set null,
  plan_id text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_events (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  event_type text not null check (event_type in ('call_answered', 'appointment_booked', 'claim_recovered', 'revenue_attributed', 'eligibility_checked', 'appointment_confirmed', 'recall_response')),
  external_reference text,
  amount_cents bigint,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.api_rate_limits (
  key_hash text primary key check (length(key_hash) = 64),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0)
);

create or replace function public.consume_api_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
  window_cutoff timestamptz;
begin
  if p_key_hash !~ '^[0-9a-f]{64}$' or p_limit < 1 or p_limit > 1000 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid rate-limit parameters';
  end if;

  window_cutoff := pg_catalog.clock_timestamp() - pg_catalog.make_interval(secs => p_window_seconds);
  insert into public.api_rate_limits (key_hash, window_started_at, request_count)
  values (p_key_hash, pg_catalog.clock_timestamp(), 1)
  on conflict (key_hash) do update set
    window_started_at = case
      when public.api_rate_limits.window_started_at <= window_cutoff then pg_catalog.clock_timestamp()
      else public.api_rate_limits.window_started_at
    end,
    request_count = case
      when public.api_rate_limits.window_started_at <= window_cutoff then 1
      else public.api_rate_limits.request_count + 1
    end
  returning request_count into current_count;

  return current_count <= p_limit;
end;
$$;

revoke all on function public.consume_api_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer) to service_role;

create index if not exists agent_events_practice_occurred_idx on public.agent_events (practice_id, occurred_at desc);
create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists api_rate_limits_window_idx on public.api_rate_limits (window_started_at);

alter table public.applications enable row level security;
alter table public.practices enable row level security;
alter table public.subscriptions enable row level security;
alter table public.agent_events enable row level security;
alter table public.api_rate_limits enable row level security;
alter table public.marketing_subscribers enable row level security;

revoke all on public.applications, public.practices, public.subscriptions, public.agent_events, public.api_rate_limits, public.marketing_subscribers from anon, authenticated;
grant all on public.applications, public.practices, public.subscriptions, public.agent_events, public.api_rate_limits, public.marketing_subscribers to service_role;