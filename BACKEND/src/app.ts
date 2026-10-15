import express from 'express';
import cors from 'cors';
import api from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', api);

app.use(notFoundHandler);
app.use(errorHandler);
