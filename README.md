# SupaSlides

Get engaged with your audience!

Webapp(s) for enabling realtime interactions between presenter and audience in a remote presentation.

## Motivation

Event after the times of Covid, remote presentations are usual. This leaves the presenter detached from the audience by
default.
Slideshow aims at bridging this gap between presenter and audience.

## What it ~~does~~ shall do in future

- Provide [Mentimeter](https://www.mentimeter.com/)-alike options for interacting with the audience.
- Webapps for the presenter and participants of the presentation: React (with emojis), ask questions
- Reusable vue components which can be integrated into the awesome [sli.dev](https://sli.dev)

## Stack

[Backend](./packages/backend) with Supabase

[Frontend](./packages/frontend) with vue.js

See dedicated ReadMe-files.

## Design Decisions

- This is a collaborative application. Thus, "local first" is not intended: Only data which made it to the server matters (no optimistic UI)
- Exception from the above is the support for anonymous guests: Since they are not allowed to access the database, the only get ephemeral data and persist this into the client's local storage.

## Status

Big WIP. It's a side project of a father with two children. Expect not much progress.

## How to get involved

Add an issue to get in touch.
