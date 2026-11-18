import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import travelRoutes from './routes/travel.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/travel', travelRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Seravita API running on http://localhost:${PORT}`);
});
