create or replace function public.insert_bet_and_deduct(
  p_title text,
  p_description text,
  p_owner_id uuid,
  p_owner_email text,
  p_amount numeric
) returns void as $$
begin
  perform 1 from public.profiles where id = p_owner_id and balance >= p_amount;
  if not found then
    raise exception 'Insufficient balance or profile not found';
  end if;

  insert into public.bets (title, description, owner_id, owner_email, amount, approved, created_at)
  values (p_title, p_description, p_owner_id, p_owner_email, p_amount, false, now());

  update public.profiles set balance = balance - p_amount where id = p_owner_id;
end;
$$ language plpgsql security definer;
