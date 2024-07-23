-- DROP FUNCTION handle_presentation_event_inserted()
create or replace function handle_presentation_event_inserted()
    returns trigger
    language plpgsql
as
$$
declare
    target_state presentation_lifecycle_status;
begin
    raise log 'event handling triggered for %', new;
    case new.type
        when 'presentation_start' then target_state = 'started';
        when 'presentation_stop' then target_state = 'stopped';
        else return new;
        end case;
    if target_state is not null then
        update postgres.public.presentations set lc_status = target_state where id = new.presentation;
    end if;
    return new;
end;
$$;

-- drop trigger if exists after_presentation_event_inserted on postgres.public.presentation_events;

create or replace trigger after_presentation_event_inserted
    after insert
    on postgres.public.presentation_events
    for each row
execute function handle_presentation_event_inserted();
