import * as Express from 'express';
import * as BodyParser from 'body-parser';
import Router from './routes';

require('dotenv').config();

// desctructuring
const {
  PORT
} = process.env;

const app = Express();

app.use(BodyParser.json());
app.use('/', Router);
app.listen(PORT);