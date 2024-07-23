create type "public"."presentation_lifecycle_status" as enum ('prepared', 'started', 'stopped', 'archived');

create type "public"."presentation_peek_type" as ("id" bigint, "title" text, "description" text, "lc_status" presentation_lifecycle_status, "presenter_username" text, "presenter_fullname" text);

drop policy "Enable insert for all users" on "public"."presentation_events";

drop policy "Enable update own events" on "public"."presentation_events";

drop policy "All users can see presentations" on "public"."presentations";

alter type "public"."event_type" rename to "event_type__old_version_to_be_dropped";

create type "public"."event_type" as enum ('presentation_start', 'presentation_stop', 'reaction', 'comment', 'slide_change', 'user_joined');

alter table "public"."presentation_events" alter column type type "public"."event_type" using type::text::"public"."event_type";

drop type "public"."event_type__old_version_to_be_dropped";

alter table "public"."presentation_events" add column "created_by_alias" text;

alter table "public"."presentation_events" add column "created_by_anon_uuid" uuid;

alter table "public"."presentation_events" alter column "value" set data type json using "value"::json;

alter table "public"."presentations" add column "description" text;

alter table "public"."presentations" add column "join_code" text;

alter table "public"."presentations" add column "lc_status" presentation_lifecycle_status not null default 'prepared'::presentation_lifecycle_status;

CREATE INDEX created_at ON public.presentation_events USING btree (created_at DESC);

CREATE INDEX creator ON public.presentation_events USING btree (created_by, created_by_anon_uuid, presentation);

CREATE INDEX join_code ON public.presentations USING btree (join_code);

CREATE INDEX presentation ON public.presentation_events USING btree (presentation);

CREATE UNIQUE INDEX presentations_join_code_key ON public.presentations USING btree (join_code);

CREATE INDEX presenter ON public.presentations USING btree (presenter);

alter table "public"."presentations" add constraint "presentations_join_code_key" UNIQUE using index "presentations_join_code_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_join_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
    new_join_code text;
begin
    if new.join_code is null then
        new_join_code = new.id::text || generate_uid(8);
        update postgres.public.presentations set join_code = new_join_code where id = new.id;
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_uid(size integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    bytes BYTEA := gen_random_bytes(size);
    l INT := length(characters);
    i INT := 0;
    output TEXT := '';
BEGIN
    WHILE i < size LOOP
            output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
            i := i + 1;
        END LOOP;
    RETURN output;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_presentation_event_inserted()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.join_presentation(t_join_code text, t_user_alias text DEFAULT NULL::text, u_user_uuid uuid DEFAULT NULL::uuid, u_user_anon_uuid uuid DEFAULT NULL::uuid)
 RETURNS generic_acknowledgement_type
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_acknowledgement generic_acknowledgement_type;
    v_presentation    presentation_peek_type;
BEGIN

    select * from presentation_peek(t_join_code) into v_presentation;

    if v_presentation is null then
        RAISE EXCEPTION 'Invalid join code!'
            USING DETAIL = 'The join code submitted do not match a presentation',
                HINT = 'check t_join_code';
    end if;

    -- check whether the user joined earlier
    select 'presentation_events', id, created_at
    from presentation_events
    where presentation = v_presentation.id
      and created_by = u_user_uuid
      and created_by_anon_uuid = u_user_anon_uuid
      and type = 'user_joined'
    INTO v_acknowledgement;

    if v_acknowledgement is not null then
        return v_acknowledgement;
    end if;

    -- Insert the event and return the inserted row
    INSERT INTO presentation_events (presentation, type, created_by, created_by_alias, created_by_anon_uuid)
    VALUES (v_presentation.id, 'user_joined', u_user_uuid, t_user_alias, u_user_anon_uuid)
    RETURNING 'presentation_events', id, created_at
        INTO v_acknowledgement;

    RETURN v_acknowledgement;
END ;
$function$
;

CREATE OR REPLACE FUNCTION public.presentation_peek(t_join_code text)
 RETURNS presentation_peek_type
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
select pres.id,
       pres.title,
       pres.description,
       pres.lc_status,
       prof.username,
       prof.full_name
from postgres.public.presentations pres
         left outer join postgres.public.profiles prof on pres.presenter = prof.id
where join_code = t_join_code;
$function$
;

CREATE OR REPLACE FUNCTION public.presentation_stop(n_presentation bigint)
 RETURNS generic_acknowledgement_type
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_acknowledgement generic_acknowledgement_type;
    v_presentation    presentations;
BEGIN
    -- Check if the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION SQLSTATE 'PGRST' USING
            message = '{
			"code": "not_authorized",
			"message": "Not authorized",
			"details": "No valid user",
			"hint": "Login first"
		}',
            detail = '{
			"status":401,
			"headers":{"X-Powered-By":"nerds"}
		}';
    END IF;

    -- verify the user is the presenter
    SELECT *
    FROM public.presentations
    WHERE presentations.id = n_presentation
    INTO v_presentation;

    IF v_presentation IS NULL THEN
        RAISE EXCEPTION SQLSTATE 'PT404' using
                message = 'Not found',
                detail = 'Presentation with the supplied ID was not found',
				hint = 'Check the ID';
    END IF;

    IF v_presentation.presenter != auth.uid() THEN
        RAISE EXCEPTION SQLSTATE 'PGRST' USING
            message = '{
					"code":"not_authorized",
					"message":"Not authorized",
					"details":"Not presenter",
					"hint": "Only the presenter of a presentation can start it"
				}',
            detail = '{
					"status":403,
			        "headers":{}
				}';
    END IF;

    -- Insert the event and return the inserted row
    INSERT INTO presentation_events (presentation, type)
    VALUES (n_presentation, 'presentation_stop')
    RETURNING 'presentation_events', id, created_at
        INTO v_acknowledgement;

    RETURN v_acknowledgement;

END ;

$function$
;

CREATE OR REPLACE FUNCTION public.send_reaction(n_presentation bigint, t_emoji text, t_user_alias text DEFAULT NULL::text, u_user_uuid uuid DEFAULT NULL::uuid, u_user_anon_uuid uuid DEFAULT NULL::uuid)
 RETURNS generic_acknowledgement_type
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_acknowledgement generic_acknowledgement_type;
BEGIN
    -- Insert the event and return the inserted row
    INSERT INTO presentation_events (presentation, type, value, created_by, created_by_alias, created_by_anon_uuid)
    VALUES (n_presentation, 'reaction', ('{"emoji": "' || t_emoji || '"}')::json, u_user_uuid, t_user_alias, u_user_anon_uuid)
    RETURNING 'presentation_events', id, created_at
        INTO v_acknowledgement;

    RETURN v_acknowledgement;
END ;
$function$
;

CREATE OR REPLACE FUNCTION public.presentation_start(n_presentation bigint)
 RETURNS generic_acknowledgement_type
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_acknowledgement generic_acknowledgement_type;
    v_presentation    presentations;
BEGIN
    -- Check if the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION SQLSTATE 'PGRST' USING
            message = '{
			"code": "not_authorized",
			"message": "Not authorized",
			"details": "No valid user",
			"hint": "Login first"
		}',
            detail = '{
			"status":401,
			"headers":{"X-Powered-By":"nerds"}
		}';
    END IF;

    -- verify the user is the presenter
    SELECT *
    FROM public.presentations
    WHERE presentations.id = n_presentation
    INTO v_presentation;

    IF v_presentation IS NULL THEN
        RAISE EXCEPTION SQLSTATE 'PT404' using
                message = 'Not found',
                detail = 'Presentation with the supplied ID was not found',
				hint = 'Check the ID';
    END IF;

    IF v_presentation.presenter != auth.uid() THEN
        RAISE EXCEPTION SQLSTATE 'PGRST' USING
            message = '{
					"code":"not_authorized",
					"message":"Not authorized",
					"details":"Not presenter",
					"hint": "Only the presenter of a presentation can start it"
				}',
            detail = '{
					"status":403,
			        "headers":{}
				}';
    END IF;

    -- Insert the event and return the inserted row
    INSERT INTO presentation_events (presentation, type)
    VALUES (n_presentation, 'presentation_start')
    RETURNING 'presentation_events', id, created_at
        INTO v_acknowledgement;

    RETURN v_acknowledgement;

END ;

$function$
;

create policy "Allow insert for authenticated"
on "public"."presentation_events"
as permissive
for insert
to authenticated
with check (true);


create policy "Insert for Anon with supplied uuid"
on "public"."presentation_events"
as permissive
for insert
to anon
with check ((created_by_anon_uuid IS NOT NULL));


CREATE TRIGGER after_presentation_event_inserted AFTER INSERT ON public.presentation_events FOR EACH ROW EXECUTE FUNCTION handle_presentation_event_inserted();

CREATE TRIGGER after_presentation_created_join_code AFTER INSERT ON public.presentations FOR EACH ROW EXECUTE FUNCTION add_join_code();



