Sure, here's the contents for the file: /traffic-violation-system/traffic-violation-system/backend/src/app.ts

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import violationRoutes from './routes/index';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/violations', violationRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;