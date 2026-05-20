-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  website text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;

-- Create RLS policy to allow users to read their own profile
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

-- Create RLS policy to allow users to update their own profile
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Create RLS policy to allow users to insert their own profile
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- Create function to handle new user signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger to automatically create a profile when a user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
