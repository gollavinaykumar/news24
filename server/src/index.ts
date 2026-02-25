import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import articleRoutes from './routes/articles.routes';
import categoryRoutes from './routes/categories.routes';
import uploadRoutes from './routes/upload.routes';
import tagRoutes from './routes/tags.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:3000',
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow any Vercel preview URL for this project
    if (
      allowed.includes(origin) ||
      origin.match(/^https:\/\/news24.*\.vercel\.app$/)
    ) {
      return callback(null, origin);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Telugu News API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
