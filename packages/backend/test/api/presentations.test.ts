import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {ensureSignIn, signOut} from './auth';
import {Presentation, PresentationPeek, testPresentation, userPresenter} from "./testdata";
import {anonymousHeaders, authenticatedHeaders} from "@/test/api/helpers";

const baseUrl = process.env.SUPABASE_URL!;

describe('Presentations API', () => {
    beforeAll(async () => {
        const session = await ensureSignIn(userPresenter)
        // delete all presentations of the test-presenter which may have been created earlier
        const response = await fetch(`${baseUrl}/rest/v1/presentations?presenter=eq.${session.user.id}`, {
            method: 'DELETE',
            headers: authenticatedHeaders(session.access_token)
        });
    })


    describe('as presenter', async () => {
        let createdPresentationId: number;

        afterAll(async () => {
            const session = await ensureSignIn(userPresenter)
            const response = await fetch(`${baseUrl}/rest/v1/presentations?id=eq.${createdPresentationId}`, {
                method: 'DELETE',
                headers: authenticatedHeaders(session.access_token)
            });
            await signOut(session.access_token)
        })

        const session = await ensureSignIn(userPresenter)
        const authToken = session.access_token

        let headers = authenticatedHeaders(authToken);
        it('should create a presentation', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentations`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Prefer': 'return=representation',
                },
                body: JSON.stringify(testPresentation())
            })

            const data = await response.json() as Presentation[];
            expect(response.status).toBe(201);
            createdPresentationId = data[0].id;
        });

        it('should get presentations', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentations`, {
                method: 'GET',
                headers
            });
            expect(response.status).toBe(200);
            const data = await response.json() as Presentation[];
            expect(data).toBeInstanceOf(Array);
            const createdPresentation = data.find(p => p.id === createdPresentationId)
            expect(createdPresentation).toMatchObject(testPresentation())
        });

        it('should update a presentation', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentations?id=eq.${createdPresentationId}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({title: 'Updated Presentation'})
            });
            expect(response.status).toBe(204);
        });

        it('should delete a presentation', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentations?id=eq.${createdPresentationId}`, {
                method: 'DELETE',
                headers
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
        const headers = anonymousHeaders()
        it('should not be able to retrieve presentations', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/presentations?id=eq.${presentation.id}`, {
                method: 'GET',
                headers
            });
            expect(response.status).toBe(200); //rls won't affect the return code, but only the content
            const data = await response.json() as Presentation[];
            expect(data).toBeInstanceOf(Array);
            expect(data.length).eq(0)
        });

        it('should be able to peek into a presentation', async () => {
            const response = await fetch(`${baseUrl}/rest/v1/rpc/presentation_peek`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    "t_join_code": presentation.join_code
                })
            });
            expect(response.status).toBe(200);
            const peek = await response.json() as PresentationPeek;
            expect(peek).toMatchObject(testPresentation())
        });
    })
});
