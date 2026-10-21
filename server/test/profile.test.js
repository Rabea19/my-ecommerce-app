import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Session } from '../src/models.js';
afterEach(()=>mock.restoreAll());
test('profile endpoint limits edits to the authenticated user name',async()=>{
 const user={_id:'507f1f77bcf86cd799439011',name:'Buyer',email:'buyer@example.com',role:'customer',save:mock.fn(async()=>{})};
 mock.method(Session,'findOne',()=>({populate:async()=>({user})}));
 const app=createApp();const cookie='market_session='+'a'.repeat(64);
 await request(app).patch('/api/auth/profile').send({name:'Guest'}).expect(401);
 for(const body of [{name:'Buyer',role:'admin'},{name:'Buyer',email:'other@example.com'},{name:'Buyer',id:'another-user'},{name:' '},{name:{$ne:null}}]) await request(app).patch('/api/auth/profile').set('Cookie',cookie).send(body).expect(400);
 assert.equal(user.save.mock.callCount(),0);
 const result=await request(app).patch('/api/auth/profile').set('Cookie',cookie).send({name:' Updated Buyer '}).expect(200);
 assert.equal(result.body.user.name,'Updated Buyer');assert.equal(result.body.user.role,'customer');assert.equal(user.save.mock.callCount(),1);
});
