import mongoose from 'mongoose';
import { createApp } from './app.js';
const app = createApp();
let connecting;
export default async function handler(req, res) {
  if (!process.env.MONGODB_URI) return res.status(503).json({error: 'Database is not configured'});
  try {
    if (mongoose.connection.readyState !== 1) {
      connecting ||= mongoose.connect(process.env.MONGODB_URI, {maxPoolSize: 5, serverSelectionTimeoutMS: 10000}).catch(error => { connecting = undefined; throw error; });
      await connecting;
    }
  } catch {
    return res.status(503).json({error: 'Database connection unavailable'});
  }
  return app(req, res);
}
