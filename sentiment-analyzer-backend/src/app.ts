import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import mongoose from 'mongoose';

require('dotenv').config();

// Only connect to MongoDB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const mongoDBUri = process.env.MONGO_DB_URI;
  const databaseName = process.env.MONGO_DB_DATABASE_NAME;

  mongoose.connect(`${mongoDBUri}/${databaseName}`);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Database connected!!!');
    console.log('mongoDBUri: ', mongoDBUri);
    console.log('databaseName: ', databaseName);
  });
}

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Custom JSON parsing error handler - must be after express.json()
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next(err);
});

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
