drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

alter table "public"."presentation_events" drop constraint "presentation_events_presentation_fkey";

drop function if exists "public"."send_reaction"(n_presentation bigint, t_emoji text, t_user_alias text, u_user_uuid uuid, u_user_anon_uuid uuid);

drop function if exists public.presentation_peek(t_join_code text);

drop type "public"."presentation_peek_type";

alter table "public"."profiles" alter column "updated_at" set default (now() AT TIME ZONE 'utc'::text);

alter table "public"."presentation_events" add constraint "presentation_events_presentation_fkey" FOREIGN KEY (presentation) REFERENCES presentations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."presentation_events" validate constraint "presentation_events_presentation_fkey";

set check_function_bodies = off;

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

    if u_user_uuid is null and (u_user_anon_uuid is null or t_user_alias is null) then
        RAISE EXCEPTION 'Insufficient user information'
            USING DETAIL = 'The information provided does not suffice to join a presentation',
                HINT = 'when not logged in, provide u_user_anon_uuid AND t_user_alias';
    end if;

    -- check whether the user joined earlier
    select 'presentation_events', id, created_at
    from presentation_events
    where presentation = v_presentation.id
      and ((u_user_uuid is not null and created_by = u_user_uuid) or
           (u_user_uuid is null and created_by_anon_uuid = u_user_anon_uuid and created_by_alias = t_user_alias))
      and type = 'user_joined'
    limit 1
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

create type "public"."presentation_peek_type" as ("id" bigint, "title" text, "description" text, "lc_status" presentation_lifecycle_status, "join_code" text, "presenter_username" text, "presenter_fullname" text);

CREATE OR REPLACE FUNCTION public.presentation_peek(t_join_code text)
 RETURNS presentation_peek_type
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
select pres.id,
       pres.title,
       pres.description,
       pres.lc_status,
       pres.join_code,
       prof.username,
       prof.full_name
from postgres.public.presentations pres
         left outer join postgres.public.profiles prof on pres.presenter = prof.id
where join_code = t_join_code;
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
    INSERT INTO presentation_events (presentation, type, is_public)
    VALUES (n_presentation, 'presentation_start', true)
    RETURNING 'presentation_events', id, created_at
        INTO v_acknowledgement;

    RETURN v_acknowledgement;

END ;

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
    INSERT INTO presentation_events (presentation, type, is_public)
    VALUES (n_presentation, 'presentation_stop', true)
    RETURNING 'presentation_events', id, created_at
        INTO v_acknowledgement;

    RETURN v_acknowledgement;

END ;

$function$
;

create policy "Enable update for own events"
on "public"."presentation_events"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Enable all access for own profile"
on "public"."profiles"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = id));




