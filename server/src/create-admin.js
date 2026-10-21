import mongoose from 'mongoose';
import { User } from './models.js';
import { credentials, hashPassword } from './security.js';
const {email,password}=credentials({email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD});
await mongoose.connect(process.env.MONGODB_URI);
try { if(await User.exists({email}))throw new Error('Account exists; refusing to overwrite or promote it automatically.');await User.create({email,name:'Administrator',passwordHash:await hashPassword(password),role:'admin'});console.log('Administrator created. Remove ADMIN_PASSWORD from the environment.'); } finally { await mongoose.disconnect(); }
