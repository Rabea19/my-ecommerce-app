import { test } from 'node:test';
import assert from 'node:assert/strict';
import { credentials, hashPassword, verifyPassword } from '../src/security.js';
import { createApp } from '../src/app.js';
import request from 'supertest';
test('password hashing is salted and verifies only the correct secret',async()=>{const a=await hashPassword('Password12345'),b=await hashPassword('Password12345');assert.notEqual(a,b);assert.equal(await verifyPassword('Password12345',a),true);assert.equal(await verifyPassword('wrong',a),false);});
test('credentials reject object injection and weak passwords',()=>{assert.throws(()=>credentials({email:{$ne:null},password:'Password12345'}));assert.throws(()=>credentials({email:'test@example.com',password:'123'}));assert.equal(credentials({email:'TEST@example.com',password:'Password12345'}).email,'test@example.com');});
test('unauthenticated private endpoints and untrusted origins are rejected',async()=>{const app=createApp();await request(app).get('/api/orders').expect(401);await request(app).get('/api/users').expect(401);await request(app).post('/api/products').send({}).expect(401);await request(app).post('/api/auth/login').set('Origin','https://evil.example').send({}).expect(403);});
