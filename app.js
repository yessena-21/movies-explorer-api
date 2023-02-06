require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const errorsHandler = require('./errors/errorHandler');
const routes = require('./routes');
const { devUrl } = require('./utils/config');
const { limiter } = require('./utils/rate-limiter');

const { PORT = 3000, DB_URL = devUrl } = process.env;

const app = express();

mongoose.connect(DB_URL);

// const options = {
//   origin: [
//     'http://localhost:3000',
//     'http://yessena.nomoredomains.club',
//     'https://yessena.nomoredomains.club',
//   ],
//   // methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   // preflightContinue: false,
//   // optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//   credentials: true,
// };

// app.use('*', cors(options));

// логгер запросов
app.use(requestLogger);

// лимитер
app.use(limiter);

app.use(cookieParser());
app.use(bodyParser.json());

app.use(helmet());
app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {

});
