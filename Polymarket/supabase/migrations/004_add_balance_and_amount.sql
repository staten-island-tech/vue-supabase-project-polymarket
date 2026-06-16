alter table if exists public.profiles
  add column if not exists balance numeric default 0;

alter table if exists public.bets
  add column if not exists amount numeric default 0;

-- Optional: ensure non-null default
update public.profiles set balance = 0 where balance is null;
update public.bets set amount = 0 where amount is null;
