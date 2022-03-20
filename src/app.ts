import express, { Application, json } from 'express';
import feeRoute from './router/fees.route';

const app: Application = express();
app.use(json());

app.use('/api/v1/fees', feeRoute);

export default app;
