-- drop type presentation_peek_type;
create type presentation_peek_type as
(
    id                 bigint,
    title              text,
    description        text,
    lc_status          presentation_lifecycle_status,
    join_code          text,
    presenter_username text,
    presenter_fullname text
);