import dotenv from 'dotenv-safe';

dotenv.config();

import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { readdirSync } from 'fs';
import { join } from 'path';
import morgan from 'morgan';
import openapi from '@ev-fns/openapi';
import { notFound } from './middlewares/notFound';
import { exception } from './middlewares/exception';

const app = express();

app.use(cors());
app.use(json());
app.use(morgan('dev'));
app.use(openapi());

const routes = readdirSync(join(__dirname, 'routes'));

for (const route of routes) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require(join(__dirname, 'routes', route)).default);
}

app.use(exception);

app.use(notFound);

app.listen(process.env.PORT, () =>
  console.log(`Listening at http://localhost:${process.env.PORT}`),
);
