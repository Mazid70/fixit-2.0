import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

// Preconnect DB once in serverless lifecycle
let isReady = false;

export default async function handler(req, res) {
  if (!isReady) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('Vercel serverless DB connect notice:', err?.message || err);
    }
    isReady = true;
  }
  return app(req, res);
}
