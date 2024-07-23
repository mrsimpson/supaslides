alter table "public"."presentation_events" add column "is_public" boolean not null default false;

set check_function_bodies = off;

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



