-- Optional: DB trigger to call edge function on each new lead
-- Requires pg_net extension and project ref.
create extension if not exists pg_net;

create or replace function public.notify_telegram_on_lead_insert()
returns trigger
language plpgsql
security definer
as $$
declare
  request_id bigint;
  payload jsonb;
  project_url text := current_setting('app.settings.supabase_url', true);
begin
  payload := jsonb_build_object(
    'type', 'INSERT',
    'record', to_jsonb(new)
  );

  if project_url is null then
    return new;
  end if;

  select net.http_post(
    url := project_url || '/functions/v1/telegram-lead-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload
  ) into request_id;

  return new;
end;
$$;

drop trigger if exists trg_notify_telegram_on_lead_insert on public.leads;
create trigger trg_notify_telegram_on_lead_insert
after insert on public.leads
for each row execute function public.notify_telegram_on_lead_insert();
