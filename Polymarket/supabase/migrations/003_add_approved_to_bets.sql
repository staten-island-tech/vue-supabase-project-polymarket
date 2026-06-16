alter table if exists public.bets
  add column if not exists approved boolean default false,
  add column if not exists owner_email text,
  add column if not exists owner_id uuid;

alter table public.bets
  add constraint if not exists bets_owner_id_fkey
  foreign key (owner_id) references auth.users (id);

update public.bets set owner_id = creator_id where owner_id is null and creator_id is not null;
