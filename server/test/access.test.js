import { test, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Session, Product, Order } from '../src/models.js';
afterEach(() => mock.restoreAll());
const id='507f1f77bcf86cd799439011';
const token='a'.repeat(64);
const cookie='market_session='+token;
function session(role) {
  return mock.method(Session,'findOne',filter => {
    assert.notEqual(filter.tokenHash,token);
    assert.ok(filter.expires.$gt instanceof Date);
    return {populate: async()=>({user:{_id:id,name:'Test',email:'test@example.test',role}})};
  });
}
test('customer cannot use administrator endpoints or see other customer orders',async()=>{
  session('customer'); const app=createApp();
  for (const [method,path] of [['get','/api/users'],['post','/api/products'],['patch','/api/products/'+id],['delete','/api/products/'+id],['patch','/api/orders/'+id],['delete','/api/orders/'+id],['post','/api/images']]) {
    await request(app)[method](path).set('Cookie',cookie).send({}).expect(403);
  }
  mock.method(Order,'find',filter=>{assert.equal(String(filter.user_id),id);assert.equal(filter.deleted,false);return {sort:async()=>[]};});
  await request(app).get('/api/orders').set('Cookie',cookie).expect('Cache-Control','no-store').expect(200);
});
test('admin can create catalog products and read all orders using the shared API',async()=>{
  session('admin');const app=createApp();
  mock.method(Product,'create',async input=>({id,...input}));
  const product=await request(app).post('/api/products').set('Cookie',cookie).send({name:'Sample',price:12,stock:3,category:'Home'}).expect(201);
  assert.equal(product.body.name,'Sample');
  mock.method(Order,'find',filter=>{assert.equal(filter.user_id,undefined);return {sort:async()=>[]};});
  await request(app).get('/api/orders').set('Cookie',cookie).expect(200);
});
test('invalid or expired sessions do not grant access and session responses cannot be cached',async()=>{
  mock.method(Session,'findOne',()=>({populate:async()=>null}));const app=createApp();
  await request(app).get('/api/orders').set('Cookie',cookie).expect(401);
  const result=await request(app).get('/api/auth/session').set('Cookie',cookie).expect('Cache-Control','no-store').expect(200);
  assert.equal(result.body.user,null);
});
