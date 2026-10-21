import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { fileURLToPath } from 'node:url';
import { createApp } from '../src/app.js';
import { User, Order, Product } from '../src/models.js';
import { hashPassword } from '../src/security.js';

// Dedicated disposable database: never reads MONGODB_URI or production secrets.
const db = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
await mongoose.connect(db.getUri());
await Promise.all([User.init(), Order.init()]);
await User.create({ email: 'admin@example.test', passwordHash: await hashPassword('TestOnlyPassword123'), role: 'admin' });
await Product.create({ name: 'Browser test phone', category: 'Mobiles', price: 125, stock: 20 });
const app = createApp();
const root = fileURLToPath(new URL('../../', import.meta.url));
app.use('/admin', express.static(root + 'admin/dist'));
app.get(/^\/admin(?:\/.*)?$/, (_req, res) => res.sendFile(root + 'admin/dist/index.html'));
app.use(express.static(root + 'build'));
app.get(/.*/, (_req, res) => res.sendFile(root + 'build/index.html'));
const server = app.listen(4000, '127.0.0.1');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(async () => {
  await mongoose.disconnect(); await db.stop(); process.exit(0);
}));
