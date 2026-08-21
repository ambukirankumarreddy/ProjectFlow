import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';

import authRoutes from './routes/auth.routes';
import orgRoutes from './routes/org.routes';
import usersRoutes from './routes/users.routes';
import tasksRoutes from './routes/tasks.routes';
import chatRoutes from './routes/chat.routes';
import notificationsRoutes from './routes/notifications.routes';
import { initWebSocketServer } from './sockets/chatSocket';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    service: 'ProjectFlow AI Enterprise Backend API',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata',
  });
});

// REST API V1 Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', orgRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationsRoutes);

// Initialize Real-Time WebSocket Gateway
initWebSocketServer(server);

const PORT = process.env.APP_PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ProjectFlow AI Enterprise API Server running on port ${PORT}`);
    console.log(`📡 WebSocket Real-Time Gateway initialized on /ws`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🏢 Allowed Google Domain: @${process.env.ALLOWED_ORG_DOMAIN || 'edgeforce.in'}`);
    console.log(`💰 Currency: INR (₹) • FY 2026-27 (Asia/Kolkata)`);
    console.log(`=======================================================`);
  });
}

export { app, server };
