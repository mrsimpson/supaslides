alter table "public"."presentation_events" drop constraint "presentation_events_presentation_fkey1";

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

set check_function_bodies = off;

create type "public"."generic_acknowledgement_type" as ("entity" text, "id" bigint, "acknowledged_at" timestamp without time zone);

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    insert into public.profiles (id, full_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.presentation_start(n_presentation bigint)
 RETURNS generic_acknowledgement_type
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_acknowledgement generic_acknowledgement_type;
    v_presentation presentations;
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
    SELECT * FROM public.presentations
    WHERE presentations.id = n_presentation
      AND presenter = auth.uid()
    INTO v_presentation;

    IF v_presentation IS NULL THEN
        RAISE EXCEPTION SQLSTATE 'PGRST' USING
            message = '{
					"code":"not_authorized",
					"message":"Not authorized",
					"details":"Not presenter",
					"hint": "Only the presenter of a presentation can start it"
				}',
            detail = '{
					"status":403,
					"headers":{"X-Powered-By":"nerds"}
				}';
    END IF;

    -- Insert the event and return the inserted row
    INSERT INTO presentation_events (presentation, type)
    VALUES (n_presentation, 'presentation_start')
    RETURNING 'presentation_events', id, created_at
        INTO v_acknowledgement;

    RETURN v_acknowledgement;

END;
$function$
;

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));



