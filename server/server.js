import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import './config/env.js'; // ✅ 1️⃣ Load environment variables
import { DBConnection } from './config/dbConnection.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/apiLimmiter.js';

// ✅ 2️⃣ Top-level await DB connection
await DBConnection();

// ✅ Initialize Express app
const app = express();

// ✅ 3️⃣ Security Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ 4️⃣ Parsing Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ 5️⃣ Rate Limiting
app.use(apiLimiter);

// ✅ 6️⃣ Routes
import authRoutes from './routes/userRoutes.js';
import ResumeScript from './routes/resumescriptroutes.js';
app.use('/api/auth', authRoutes);
app.use('/api/resume-scripts', ResumeScript);

// ✅ 7️⃣ Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    dbConnected: mongoose.connection.readyState === 1
  });
});

// ✅ 8️⃣ Simple homepage
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome</title>
        <style>
          body {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; margin: 0; background-color: #f9f9f9;
            font-family: Arial, sans-serif;
          }
          h1 { font-style: italic; color: #333; }
        </style>
      </head>
      <body>
        <h1><u><i>Welcome to the <b>AI Resume Video</b> SaaS Server!</i></u></h1>
      </body>
    </html>
  `);
});

// ✅ 9️⃣ Global Error Handler (must be after all routes)
app.use(errorHandler);

// ✅ 🔄 Graceful Shutdown
process.on('SIGINT', async () => {
  logger.info('🔄 Gracefully shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});

// ✅ Start server
const port = process.env.PORT || 6000;
app.listen(port, () => {
  logger.info(`🚀 Server running at http://localhost:${port} [${process.env.NODE_ENV}]`);
});
