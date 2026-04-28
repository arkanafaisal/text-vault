import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import 'dotenv/config'


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

const PORT = process.env.PORT 
const server = app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)})



  

import { userRouter } from './router/user.router.js';
import { authRouter } from './router/auth.router.js';
import { dataRouter } from './router/data.router.js';
import { publicRouter } from './router/public.router.js';
import { feedbackRouter } from './router/feedback.router.js';

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/api/public', publicRouter);
app.use('/api/feedback', feedbackRouter);

import { errorHandler } from './middleware/errorHandler.js';
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