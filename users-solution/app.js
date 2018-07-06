const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/users', usersRoutes);

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

app.listen(3000, function() {
  console.log('Server starting on port 3000!');
});
