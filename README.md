# Slideshow frontend

Webapps for enabling realtime interactions between presenter and audience in a remote presentation.

## Motivation

Event after the times of Covid, remote presentations are usual. This leaves the presenter detached from the audience by
default.
Slideshow aims at bridging this gap between presenter and audience.

## What it ~~does~~ shall do in future

- Provide [Mentimeter](https://www.mentimeter.com/)-alike options for interacting with the audience.
- Webapps for the presenter and participants of the presentation: React (with emojis), ask questions
- Reusable vue components which can be integrated into the awesome [sli.dev](https://sli.dev)

## Stack

- vue3. Nuxt is intentionally excluded as the app shall be deployable without the need of a server (e. g. on GH pages)
- As few dependencies as possible. Majorly dev dependencies and the
  wonderful [naive-ui components-library](https://www.naive-ui.com)
- Jest for unit-testing
- Playwright for integration testing (if necessary)

## Getting started

- checkout this repo
- checkout the [backend](https://github.com/mrsimpson/slideshow-backend) (there are no mocks yet). See the repo how to
  start it.
- Copy [`.env.template`](./.env.template) to `.env.local` and provide your supabase credentials
- `npm i && npm run dev`
- http://localhost:5173/
- Create a user (using the backend)
- Create a presentation (using the API, see backend-repo for http-requests)
- Copy the join code
- Access `http://localhost:5173/join?code=<...>`

## Design principles and responsibilities

- The router is responsible for propagating data which the user of the app knows of (as path- or query params)
- The router delegates to [views](./src/views). Views provide a context for a set of semantically connected user
  interaction (such as all interactions in the context of a presenter). The view initializes all the necessary stores
  and instantiates set of components for a particular process.
- [Stores](./src/stores) are responsible for proxying all interaction to the backend. Thus, stores are the only places,
  in which `supabase.js` is consumed. All manipulating operations to the state happen inside actions of the stores.
- [Components](./src/components) are either
    - "render components" which get all their data using `props`
    - "rich components" which allow manipulation of the applications state through interactions with the stores.

## Status

Big WIP. It's a side project of a father with two children. Expect not much progress.

## How to get involved

Add an issue to get in touch.
