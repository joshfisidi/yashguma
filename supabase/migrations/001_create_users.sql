create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up row level security
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data" on users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on users
  for update using (auth.uid() = id);

-- Create trigger to handle updated_at
create trigger handle_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);
