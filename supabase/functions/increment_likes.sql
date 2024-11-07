create or replace function increment_likes(item_id uuid)
returns void as $$
begin
  update carousel_items
  set likes = likes + 1
  where id = item_id;
end;
$$ language plpgsql;
