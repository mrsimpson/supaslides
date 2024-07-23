-- drop function if exists add_join_code

create or replace function add_join_code()
    returns trigger
    language plpgsql
as
$$
declare
    new_join_code text;
begin
    if new.join_code is null then
        new_join_code = new.id::text || generate_uid(8);
        update postgres.public.presentations set join_code = new_join_code where id = new.id;
    end if;
    return new;
end;
$$;

-- drop trigger if exists after_presentation_created_join_code on postgres.public.presentation_events;

create or replace trigger after_presentation_created_join_code
    after insert
    on postgres.public.presentations
    for each row
execute function add_join_code();
