-- DROP FUNCTION public.join_presentation(text, text, uuid, uuid);

CREATE OR REPLACE FUNCTION public.join_presentation(
    t_join_code text,
    t_user_alias text default null,
    u_user_uuid uuid default null,
    u_user_anon_uuid uuid default null
)
    RETURNS generic_acknowledgement_type
    LANGUAGE plpgsql
    security definer
AS
$$
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
$$;
