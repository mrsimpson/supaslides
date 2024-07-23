-- DROP TYPE public.generic_acknowledgement_type;

CREATE TYPE public.generic_acknowledgement_type AS (
                                                       entity text,
                                                       id int8,
                                                       acknowledged_at timestamp);
