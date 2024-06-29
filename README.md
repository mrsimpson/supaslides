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
  wonderful [naive-ui components-library](naive-ui.com)
- Jest for unit-testing
- Playwright for integration testing (if necessary)

## Getting started

- checkout this repo
- checkout the [backend](https://github.com/mrsimpson/slideshow-backend) (there are no mocks yet)
- `npm i && npm run dev`
- http://localhost:5173/
- Create a user (using the backend)
- Create a presentation (using the API, see backend-repo for http-requests)
- Copy the join code
- Access `http://localhost:5173/join?code=<...>`

## Status

Big WIP. It's a side project of a father with two children. Expect not much progress.

## How to get involved

Add an issue to get in touch.
