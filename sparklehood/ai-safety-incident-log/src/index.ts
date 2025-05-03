import express, { Request, Response, NextFunction } from 'express';
import incidentsRouter from './routes/incidents';

const app = express();
app.use(express.json());

app.use('/incidents', incidentsRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
