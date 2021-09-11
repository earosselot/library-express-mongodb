const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const { MONGOUSER, MONGOPASS, PROD_MONGO_URL } = process.env;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();

console.log('starting app...');

// mongoDB setup
const mongoose = require('mongoose');
const dev_mongoDB_url = `mongodb+srv://${MONGOUSER}:${MONGOPASS}@cluster0.fvux7.mongodb.net/local_library?retryWrites=true&w=majority`;
const mongoDB = PROD_MONGO_URL || dev_mongoDB_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedtopology: true });
mongoose.connection.on('connecting', () => console.log('Connecting to MongoDB...'));
mongoose.connection.on('connected', () => console.log('Connection to MongoDB is established'));
mongoose.connection.on('disconnected', () => console.log('Connection to MongoDB is closed'));
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Protection against vulnerabilities
app.use(helmet());

// Compress all routes
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
