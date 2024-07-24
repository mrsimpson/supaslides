// tests/presentation_events.test.ts
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {ensureSignIn, signOut} from './auth';
import {anonymousHeaders, authenticatedHeaders} from "@/test/api/helpers";
import {Presentation, PresentationEvent, testPresentation, userPresenter} from "@/test/api/testdata";
import {randomUUID} from "node:crypto";
import {baseUrl} from "@/test/api/config";

describe('Presentation Events API', () => {
    describe('as the presenter', async () => {
        let createdEventId: number;
        let presentationId: number
        let authToken: string

        beforeAll(async () => {
            const {access_token, user} = await ensureSignIn(userPresenter)
            authToken = access_token

            // delete all presentations of the test-presenter which may have been created earlier
            await fetch(`${baseUrl}/rest/v1/presentations?presenter=eq.${user.id}`, {
                method: 'DELETE',
                headers: authenticatedHeaders(authToken)
            });

            // make a presenter create a presentation to comment on
            const response = await fetch(`${baseUrl}/rest/v1/presentations`, {
                method: 'POST',
                headers: {
                    ...authenticatedHeaders(access_token),
                    'Prefer': 'return=representation',
                },
                body: JSON.stringify(testPresentation())
            })

            const data = await response.json() as Presentation[];
            expect(response.status).toBe(201);
            presentationId = data[0].id;
        })

        afterAll(async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentations?id=eq.${presentationId}`, {
                method: 'DELETE',
                headers: authenticatedHeaders(authToken)
            });
            await signOut(authToken)
        })
        it('should create a presentation event', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentation_events`, {
                method: 'POST',
                headers: {...authenticatedHeaders(authToken), Prefer: 'return=representation'},
                body: JSON.stringify({
                    presentation: presentationId,
                    type: 'reaction',
                    value: {reaction: 'thumbs_up'},
                    is_public: true
                })
            });
            const data = await response.json() as PresentationEvent[];
            expect(response.status).toBe(201);
            createdEventId = data[0].id;
        });

        it('should get presentation events', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentation_events`, {
                method: 'GET',
                headers: authenticatedHeaders(authToken)
            });
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toBeInstanceOf(Array);
        });

        it('should update a presentation event', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentation_events?id=eq.${createdEventId}`, {
                method: 'PATCH',
                headers: {...authenticatedHeaders(authToken), Prefer: 'return=representation'},
                body: JSON.stringify({value: {reaction: 'thumbs_down'}})
            });
            expect(response.status).toBe(200);
            const data = await response.json() as PresentationEvent[]
            expect(data[0]).toMatchObject({
                value: {
                    reaction: 'thumbs_down'
                }
            })
        });

        it('should delete a presentation event', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentation_events?id=eq.${createdEventId}`, {
                method: 'DELETE',
                headers: authenticatedHeaders(authToken)
            });
            expect(response.status).toBe(204);
        });
    })

    describe('as anonymous', async () => {
        let presentation: Presentation
        beforeAll(async () => {
            const {access_token, user} = await ensureSignIn(userPresenter)

            // make a presenter create a presentation to comment on
            const response = await fetch(`${baseUrl}/rest/v1/presentations`, {
                method: 'POST',
                headers: {
                    ...authenticatedHeaders(access_token),
                    'Prefer': 'return=representation',
                },
                body: JSON.stringify(testPresentation())
            })

            const data = await response.json() as Presentation[];
            expect(response.status).toBe(201);
            presentation = data[0]
        })

        afterAll(async () => {
            const {access_token, user} = await ensureSignIn(userPresenter)

            const response = await fetch(`${baseUrl}/rest/v1/presentations?id=eq.${presentation.id}`, {
                method: 'DELETE',
                headers: authenticatedHeaders(access_token)
            });
            await signOut(access_token)
        })

        it('should be able to send a reaction with proper anon information', async () => {

            const payload = {
                presentation: presentation.id,
                type: "reaction",
                value: JSON.stringify({emoticon: "", emojiText: "metal"})
            }
            let response = await fetch(`${baseUrl}/rest/v1/presentation_events`,
                {
                    method: 'POST',
                    headers: anonymousHeaders(),
                    body: JSON.stringify(payload)
                });
            expect(response.status, 'Not allowed without anon user information').toBe(401);

            response = await fetch(`${baseUrl}/rest/v1/presentation_events`,
                {
                    method: 'POST',
                    headers: {...anonymousHeaders(), Prefer: 'return=minimal'},
                    body: JSON.stringify({...payload, created_by_anon_uuid: randomUUID(), created_by_alias: 'Arno Nym'})
                });
            expect(response.status, 'allowed with anon information').toBe(201);
        });

        it('should possible to join a presentation with the proper join code', async () => {

            const body = {
                t_join_code: presentation.join_code,
                u_user_uuid: null
            }
            let response = await fetch(`${baseUrl}/rest/v1/rpc/join_presentation`, {
                method: 'POST',
                headers: anonymousHeaders(),
                body: JSON.stringify(body)
            });
            expect(response.status, 'Not allowed without anon user information').toBe(400);

            response = await fetch(`${baseUrl}/rest/v1/rpc/join_presentation`, {
                method: 'POST',
                headers: anonymousHeaders(),
                body: JSON.stringify({...body, t_user_alias: 'Arno Nym', u_user_anon_uuid: randomUUID()})
            });
            expect(response.status, 'allowed with anon information').toBe(200);
        });
    })
});
