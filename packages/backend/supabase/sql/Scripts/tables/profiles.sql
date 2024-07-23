-- auto-generated definition
create table profiles
(
    id         uuid not null
        primary key
        references auth.users,
    updated_at timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    username   text
        unique
        constraint username_length
            check (char_length(username) >= 3),
    full_name  text,
    avatar_url text,
    website    text
);

alter table profiles
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on profiles to anon;

grant delete, insert, references, select, trigger, truncate, update on profiles to authenticated;

grant delete, insert, references, select, trigger, truncate, update on profiles to service_role;

