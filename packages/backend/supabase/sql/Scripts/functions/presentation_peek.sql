-- DROP FUNCTION public.presentation_peek(text);

CREATE OR REPLACE FUNCTION public.presentation_peek(
    t_join_code text
)
    RETURNS presentation_peek_type
    security DEFINER
AS
$$
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
$$ LANGUAGE sql;
