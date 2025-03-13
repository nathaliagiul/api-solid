 import request from 'supertest'
 import { app } from '@/app'
 import { afterAll, beforeAll, describe, expect, it } from 'vitest'
 
 describe('Refresh Token (e2e)', () => {
   beforeAll(async () => {
     await app.ready()
   })
 
   afterAll(async () => {
     await app.close()
   })
 
   it('should be able to refresh a token', async () => {
     await request(app.server).post('/users').send({
       name: 'John Doe',
       email: 'johndoe@example.com',
       password: '123456',
     })
 
     const authResponse = await request(app.server).post('/sessions').send({
       email: 'johndoe@example.com',
       password: '123456',
     })
 
     const cookies: string[] | undefined = authResponse.get('Set-Cookie');

     if (cookies && cookies.length > 0) {
       const response = await request(app.server)
         .patch('/token/refresh')
         .set('Cookie', cookies)
         .send();
     } else {
       throw new Error('Refresh token cookie não encontrado ou inválido');
     } 
     
     const response = await request(app.server)
       .patch('/token/refresh')
       .set('Cookie', cookies)
       .send()
 
     expect(response.status).toEqual(200)
     expect(response.body).toEqual({
       token: expect.any(String),
     })
     expect(response.get('Set-Cookie')).toEqual([
       expect.stringContaining('refreshToken='),
     ])
   })
 })