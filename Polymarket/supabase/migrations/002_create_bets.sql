create table public.bets (
  id bigint generated always as identity not null,
  title text not null,
  description text null,
  creator_id uuid null,
  status text null default 'pending'::text,
  created_at timestamp without time zone null default now(),
  constraint bets_pkey primary key (id),
  constraint bets_creator_id_fkey foreign KEY (creator_id) references auth.users (id)
) TABLESPACE pg_default;
