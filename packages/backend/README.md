# Slideshow-backend

A supabase-based backend for realtime slideshow-interactions.

## Motivation

Event after the times of Covid, remote presentations are usual. This leaves the presenter detached from the audience by default.
Slideshow aims at bridging this gap between presenter and audience.

## What it ~~does~~ shall do in future

- Provide [Mentimeter](https://www.mentimeter.com/)-alike options for interacting with the audience.
- Aggregate reactions, questions and so on in real time for the presenter so that (s)he can react even while giving the presentation.
- Provide statistics after the presentation has ended, so that thre presenter can adjust for a subsequent presentation.

## Stack

- Supabase for state-oriented features.
- Do it the supabase way: Use DB-inbuilt-features wherever possible (RLS, constraints, defaults, database functions)

## Getting started

- Check this repo out
- Install the [Supabase CLI](https://github.com/supabase/cli)
- `supabase start`
- open your [local dev environment on http://localhost:54323/](http://localhost:54323/) and explore tables and functions
- check the scripts in the `./test` folder for some API-calls

## Architectural decisions

- Use RLS for managing access to all kinds of data. It should not be verified in any other way that a user is authorized to access a particular item
- If RLS needs to be bypassed for an exceptional reason (e. g. a non-authenticated user needs to be able to see some basic information of presentations), provide a database function which runs with privileged access.
- In order to lower the barrier for users to join presentations and provide feedback, authentication is not required. In this case, write-only-access is granted to anonymous users. The client needs to manage the resulting state itself, as RLS will prevent access to the written data (as there's no authentication in this case).
