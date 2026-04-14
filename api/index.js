// Vercel Serverless Function — wraps the Express app
import app, { connectDB } from '../server/app.js';

// Connect to MongoDB once per cold start
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}
