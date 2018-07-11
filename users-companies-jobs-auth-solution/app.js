require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const companiesRoutes = require('./routes/companies');
const jobsRoutes = require('./routes/jobs');
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/companies', companiesRoutes);
app.use('/jobs', jobsRoutes);
app.use('/users', usersRoutes);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

// global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

module.exports = app;
