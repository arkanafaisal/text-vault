import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import 'dotenv/config'
import { logger } from './libs/logger.lib.js'


const app = express()
app.use(express.json())
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
  origin: process.env.NODE_ENV === "development"? ['http://127.0.0.1:5173', 'http://localhost:5173'] : `https://${process.env.PROJECT_NAME}.arkanafaisal.my.id`,
  credentials: true,
  allowedHeaders: ['Content-Type', 'accessToken'],   // opsional, header yg diizinkan
  preflightContinue: false,
  optionsSuccessStatus: 204
}))


app.use((req, res, next) => {
  if(!(req.url.startsWith('/api'))){ return next() }
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start
    });
  });
  next();
});

import { userRouter } from './routes/user.route.js';
import { authRouter } from './routes/auth.route.js';
import { dataRouter } from './routes/data.route.js';
import { publicRouter } from './routes/public.route.js';
import { feedbackRouter } from './routes/feedback.route.js';

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/api/public', publicRouter);
app.use('/api/feedback', feedbackRouter);

import { errorHandler } from './middlewares/error-handler.middleware.js';
app.use(errorHandler)



import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});



const PORT = process.env.PORT
const server = app.listen(PORT, ()=>{ logger.info(`server running on ${PORT}`) })

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  logger.info('shutting down...');

  server.close(() => {
    logger.info('server closed');
    process.exit(0);
  });
}