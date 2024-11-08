-- Drop existing user_likes table if exists
drop table if exists public.user_likes;

-- Create new user_likes table with proper constraints
create table public.user_likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  item_id uuid references public.carousel_items(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, item_id)
);

-- Set up row level security
alter table public.user_likes enable row level security;

-- Create policies
create policy "Users can view their own likes"
  on public.user_likes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own likes"
  on public.user_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.user_likes for delete
  using (auth.uid() = user_id);
