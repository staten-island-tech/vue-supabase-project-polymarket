alter table if exists public.bets
  add column if not exists return_rate numeric default 1.0;

update public.bets set return_rate = 1.0 where return_rate is null;
