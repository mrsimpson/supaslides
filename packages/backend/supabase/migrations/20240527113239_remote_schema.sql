
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."event_type" AS ENUM (
    'presentation_start',
    'presentation_terminate',
    'reaction',
    'comment',
    'slide_change'
);

ALTER TYPE "public"."event_type" OWNER TO "postgres";

COMMENT ON TYPE "public"."event_type" IS 'Events in a presentation. Defines the schema of the value';

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."presentation" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "presenter" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."presentation" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."presentation_events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "value" "jsonb",
    "presentation" bigint NOT NULL,
    "type" "public"."event_type" NOT NULL
);

ALTER TABLE "public"."presentation_events" OWNER TO "postgres";

ALTER TABLE "public"."presentation_events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."presentation_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."presentation" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."presentation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."presentation_events"
    ADD CONSTRAINT "presentation_events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."presentation"
    ADD CONSTRAINT "presentation_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."presentation_events"
    ADD CONSTRAINT "presentation_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."presentation_events"
    ADD CONSTRAINT "presentation_events_presentation_fkey" FOREIGN KEY ("presentation") REFERENCES "public"."presentation"("id") ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."presentation_events"
    ADD CONSTRAINT "presentation_events_presentation_fkey1" FOREIGN KEY ("presentation") REFERENCES "public"."presentation"("id") ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."presentation"
    ADD CONSTRAINT "presentation_presenter_fkey" FOREIGN KEY ("presenter") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;

CREATE POLICY "All users can see presentations" ON "public"."presentation" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable all access for presenter" ON "public"."presentation" USING ((( SELECT "auth"."uid"() AS "uid") = "presenter"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."presentation_events" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable reading own events" ON "public"."presentation_events" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Enable update own events" ON "public"."presentation_events" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Presenter can see all events for own presentation" ON "public"."presentation_events" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "presentation"."presenter"
   FROM "public"."presentation"
  WHERE ("presentation"."id" = "presentation_events"."presentation"))));

ALTER TABLE "public"."presentation" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."presentation_events" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."presentation";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."presentation_events";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."presentation" TO "anon";
GRANT ALL ON TABLE "public"."presentation" TO "authenticated";
GRANT ALL ON TABLE "public"."presentation" TO "service_role";

GRANT ALL ON TABLE "public"."presentation_events" TO "anon";
GRANT ALL ON TABLE "public"."presentation_events" TO "authenticated";
GRANT ALL ON TABLE "public"."presentation_events" TO "service_role";

GRANT ALL ON SEQUENCE "public"."presentation_events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."presentation_events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."presentation_events_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."presentation_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."presentation_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."presentation_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
