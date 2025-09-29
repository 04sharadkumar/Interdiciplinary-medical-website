// backend/server.js
import 'dotenv/config'; // dotenv auto config
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// ====== DATABASE CONNECTION ======
import connectDB from './config/db.js';

// ====== ROUTES ======
import authRoutes from './routes/user.routes.js';
// import other routes if available
// import inventoryRoutes from './routes/inventory.routes.js';
// import supplierRoutes from './routes/supplier.routes.js';

// ====== MIDDLEWARE ======
import errorHandler from './middleware/errorHandler.js';

// ====== __dirname FIX FOR ESM ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ====== SECURITY MIDDLEWARE ======
app.use(helmet());

// ====== CORS CONFIG ======
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));

// ====== BODY PARSERS ======
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ====== STATIC FILES ======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== CONNECT DB ======
connectDB();

// ====== ROUTES ======
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/suppliers', supplierRoutes);

// ====== HEALTH CHECK ======
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Hospital Inventory API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ====== ERROR HANDLER ======
app.use(errorHandler);

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// ====== UNHANDLED PROMISE REJECTIONS ======
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});
