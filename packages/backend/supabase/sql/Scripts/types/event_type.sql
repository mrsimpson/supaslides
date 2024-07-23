-- auto-generated definition
create type event_type as enum ('presentation_start', 'presentation_terminate', 'reaction', 'comment', 'slide_change');

comment on type event_type is 'Events in a presentation. Defines the schema of the value';

alter type event_type owner to postgres;

