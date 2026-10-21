import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import { User, Product, Order, Session, Image } from './models.js';
import { digest, credentials, hashPassword, verifyPassword, fail } from './security.js';
const cookie = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' };
const publicUser = u => ({ id: String(u._id), email: u.email, name: u.name, role: u.role, created_at: u.created_at });
const validId = id => { if (!mongoose.isObjectIdOrHexString(id)) fail(400, 'Invalid ID'); return id; };
const productInput = body => {
  const { name, price, stock, category, image = '', description = '' } = body;
  if (typeof name !== 'string' || !name.trim() || name.length > 200 || typeof category !== 'string' || !category.trim() || category.length > 80 || !Number.isFinite(price) || price < 0 || price > 10000000 || !Number.isInteger(stock) || stock < 0 || stock > 10000000 || typeof image !== 'string' || image.length > 2000 || (image && !/^\/api\/images\/[a-f0-9]{24}$|^https:\/\//.test(image)) || typeof description !== 'string' || description.length > 5000) fail(400, 'Invalid product fields');
  return { name: name.trim(), price: Math.round(price * 100) / 100, stock, category: category.trim(), image, description };
};
export function createApp() {
 const app = express();
 app.disable('x-powered-by');
 if (process.env.VERCEL) app.set('trust proxy', 1);
 app.use(helmet({ contentSecurityPolicy: false }), cookieParser());
 // Same-origin clients only; non-browser API clients may omit Origin.
 app.use('/api', (req,res,next) => { const origin = req.get('origin'); const allowed = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:4000').split(',').map(value => value.trim()).filter(Boolean); for (const host of [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) { if (host) allowed.push('https://' + host); } if (origin && !allowed.includes(origin)) return res.status(403).json({ error: 'Origin not allowed' }); next(); });
 app.use('/api', rateLimit({ windowMs: 60000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));
 app.get('/api/health', (_req,res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable' }));
 app.use(['/api/auth', '/api/orders', '/api/users'], (_req,res,next) => { res.set('Cache-Control','no-store'); next(); });
 app.use('/api', async (req,_res,next) => { const token = req.cookies.market_session; if (typeof token === 'string' && token.length === 64) { const session = await Session.findOne({ tokenHash: digest(token), expires: { $gt: new Date() } }).populate('user'); req.user = session?.user; } next(); });
 const auth = (req,_res,next) => { if (!req.user) fail(401,'Please sign in'); next(); };
 const admin = (req,_res,next) => { if (req.user?.role !== 'admin') fail(403,'Administrator access required'); next(); };
 app.post('/api/images', auth, admin, express.raw({ type: ['image/png','image/jpeg','image/webp'], limit: '2mb' }), async (req,res) => {
   const b = req.body; const type = req.get('content-type');
   const valid = Buffer.isBuffer(b) && ((type === 'image/png' && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) || (type === 'image/jpeg' && b[0] === 255 && b[1] === 216 && b[2] === 255) || (type === 'image/webp' && b.toString('ascii',0,4) === 'RIFF' && b.toString('ascii',8,12) === 'WEBP'));
   if (!valid) fail(400,'Upload a PNG, JPEG or WebP image (max 2 MB)');
   const img = await Image.create({ bytes: b, type }); res.status(201).json({ url: `/api/images/${img.id}` });
 });
 app.get('/api/images/:id', async (req,res) => { const img = await Image.findById(validId(req.params.id)); if (!img) fail(404,'Image not found'); res.set('Cache-Control','public, max-age=31536000, immutable').type(img.type).send(img.bytes); });
 app.use(express.json({ limit: '100kb' }));
 const loginLimiter = rateLimit({ windowMs: 15*60000, limit: 25, standardHeaders: 'draft-8', legacyHeaders: false });
 async function sessionFor(user,res) { const token = randomBytes(32).toString('hex'); const expires = new Date(Date.now()+7*86400000); await Session.create({ tokenHash: digest(token), user: user._id, expires }); res.cookie('market_session',token,{ ...cookie, expires }); res.json({ user: publicUser(user) }); }
 app.post('/api/auth/register', loginLimiter, async (req,res) => { const { email, password } = credentials(req.body); const user = await User.create({ email, passwordHash: await hashPassword(password), name: email.split('@')[0], role: 'customer' }); await sessionFor(user,res); });
 app.post('/api/auth/login', loginLimiter, async (req,res) => { const { email, password } = credentials(req.body); const user = await User.findOne({ email }).select('+passwordHash'); if (!user || !await verifyPassword(password,user.passwordHash)) fail(401,'Invalid email or password'); if (req.body.admin && user.role !== 'admin') fail(403,'Administrator access required'); await sessionFor(user,res); });
 app.patch('/api/auth/profile', auth, async (req,res) => {
   if (!req.body || Object.keys(req.body).some(key => key !== 'name') || typeof req.body.name !== 'string' || !req.body.name.trim() || req.body.name.trim().length > 100) fail(400,'Provide a name of 1–100 characters');
   req.user.name = req.body.name.trim();
   await req.user.save();
   res.json({user:publicUser(req.user)});
 });
 app.get('/api/auth/session', (req,res) => res.json({ user: req.user ? publicUser(req.user) : null }));
 app.post('/api/auth/logout', async (req,res) => { if (req.cookies.market_session) await Session.deleteOne({ tokenHash: digest(req.cookies.market_session) }); res.clearCookie('market_session',cookie).json({ ok: true }); });
 app.get('/api/products', async (_req,res) => res.json(await Product.find({ deleted: false }).sort({ created_at: -1 })));
 app.get('/api/products/:id', async (req,res) => { const product = await Product.findOne({ _id: validId(req.params.id), deleted: false }); if (!product) fail(404,'Product not found'); res.json(product); });
 app.post('/api/products',auth,admin,async (req,res) => res.status(201).json(await Product.create(productInput(req.body))));
 app.patch('/api/products/:id',auth,admin,async (req,res) => { const p = await Product.findOneAndUpdate({ _id:validId(req.params.id),deleted:false },productInput(req.body),{new:true,runValidators:true}); if(!p) fail(404,'Product not found');res.json(p); });
 app.delete('/api/products/:id',auth,admin,async(req,res)=> { const p=await Product.findOneAndUpdate({_id:validId(req.params.id),deleted:false},{deleted:true});if(!p)fail(404,'Product not found');res.json({ok:true}); });
 app.get('/api/users',auth,admin,async(_req,res)=>res.json((await User.find().sort({created_at:-1})).map(publicUser)));
 app.get('/api/orders',auth,async(req,res)=>res.json(await Order.find({deleted:false,...(req.user.role==='admin'?{}:{user_id:req.user._id})}).sort({created_at:-1})));
 app.post('/api/orders',auth,async(req,res)=>{
   const key=req.get('Idempotency-Key'); if(typeof key!=='string'||! /^[\w-]{16,100}$/.test(key))fail(400,'Idempotency-Key required');
   const existing=await Order.findOne({user_id:req.user._id,idempotencyKey:key}); if(existing)return res.json(existing);
   const items=req.body.products; if(!Array.isArray(items)||!items.length||items.length>100)fail(400,'Cart must contain 1–100 items');
   const ids=new Set();for(const item of items){ validId(item.id);if(ids.has(item.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>100)fail(400,'Invalid cart quantities');ids.add(item.id); }
   let order;const session=await mongoose.startSession();
   try{ await session.withTransaction(async()=>{
     const products=[];let cents=0;
     for(const item of items){const p=await Product.findOneAndUpdate({_id:item.id,deleted:false,stock:{$gte:item.quantity}},{$inc:{stock:-item.quantity}},{session,new:true});if(!p)fail(409,'A product is unavailable or has insufficient stock');products.push({id:p.id,title:p.name,image:p.image,category:p.category,price:p.price,quantity:item.quantity});cents+=Math.round(p.price*100)*item.quantity;}
     [order]=await Order.create([{user_id:req.user._id,products,total_price:cents/100,status:'pending',idempotencyKey:key}],{session});
   });}catch(error){if(error.code===11000){order=await Order.findOne({user_id:req.user._id,idempotencyKey:key});if(!order)throw error;}else throw error;}finally{await session.endSession();}
   res.status(201).json(order);
 });
 app.patch('/api/orders/:id',auth,admin,async(req,res)=>{
   const status=req.body.status;if(!['pending','completed','canceled'].includes(status))fail(400,'Invalid order status');
   let order;const session=await mongoose.startSession();try{await session.withTransaction(async()=>{
     order=await Order.findOne({_id:validId(req.params.id),deleted:false}).session(session);if(!order)fail(404,'Order not found');if(order.status===status)return;if(order.status!=='pending')fail(409,'Completed or canceled orders cannot be reopened');
     if(status==='canceled')for(const item of order.products)await Product.updateOne({_id:item.id},{$inc:{stock:item.quantity}},{session});
     order.status=status;await order.save({session});
   });}finally{await session.endSession();}res.json(order);
 });
 app.delete('/api/orders/:id',auth,admin,async(req,res)=>{const order=await Order.findById(validId(req.params.id));if(!order)fail(404,'Order not found');if(order.status==='pending')fail(409,'Cancel the order before deleting it');order.deleted=true;await order.save();res.json({ok:true});});
 app.use('/api',(_req,res)=>res.status(404).json({error:'Endpoint not found'}));
 app.use((err,_req,res,_next)=>{const status=err.status|| (err.code===11000?409:500);if(status===500)console.error(err);res.status(status).json({error:err.code===11000?'Account already exists':status===500?'Unexpected server error':err.message});});
 return app;
}
