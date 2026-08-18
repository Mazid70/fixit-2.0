import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Disable x-powered-by for security and slightly reduced byte payload
app.disable('x-powered-by');

// Enable Gzip/Deflate compression for all responses
app.use(
  compression({
    level: 6,
    threshold: 512, // Compress payloads larger than 512 bytes
  })
);

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // required for vite preview scripts & external fonts/images
    crossOriginEmbedderPolicy: false,
  })
);

// Allow requests from any origin but reflect origin for credentialed requests
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Quick micro-caching headers for public GET routes
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path.startsWith('/api/services/categories')) {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
  } else if (req.method === 'GET' && req.path.startsWith('/api/services') && !req.path.includes('/my-services')) {
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
  } else if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FIXIT On-Demand Services Platform',
    timestamp: new Date().toISOString(),
  });
});

// RESTful API Routes matching database schema
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Fallback error handlers for /api
app.use('/api/*', notFound);
app.use(errorHandler);

export default app;
