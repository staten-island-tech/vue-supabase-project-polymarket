alter table if exists public.profiles
  add column if not exists balance numeric default 0;

alter table if exists public.bets
  add column if not exists amount numeric default 0;

update public.profiles set balance = 1000 where balance is null;
update public.bets set amount = 100 where amount is null;
