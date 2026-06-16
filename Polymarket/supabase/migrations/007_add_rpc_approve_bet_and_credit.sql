create or replace function public.approve_bet_and_credit(p_bet_id bigint, p_admin_id uuid) returns void as $$
declare
  b record;
begin
  select * into b from public.bets where id = p_bet_id for update;
  if not found then
    raise exception 'Bet not found';
  end if;
  if b.approved then
    raise exception 'Bet already approved';
  end if;

  update public.bets set approved = true where id = p_bet_id;

  -- credit owner's balance
  if b.owner_id is not null then
    update public.profiles set balance = coalesce(balance,0) + (coalesce(b.amount,0) * coalesce(b.return_rate,1)) where id = b.owner_id;
  end if;
end;
$$ language plpgsql security definer;
