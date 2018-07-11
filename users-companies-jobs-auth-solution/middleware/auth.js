const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

exports.authRequired = (req, res, next) => {
  try {
    const authHeaderValue = req.headers.authorization;
    jwt.verify(authHeaderValue, SECRET);
    return next();
  } catch (e) {
    console.log(e);
    const unauthorized = new Error('You must authenticate first.');
    unauthorized.status = 401;
    return next(unauthorized);
  }
};

exports.getIdFromToken = (req, res, next) => {
  try {
    const authHeaderValue = req.headers.authorization;
    const token = jwt.verify(authHeaderValue, SECRET);
    if (token.user_id) {
      req.user_id = token.user_id;
    } else if (token.company_id) {
      req.company_id = token.company_id;
    }
    return next();
  } catch (e) {
    console.log(e);
    const unauthorized = new Error('You must authenticate first.');
    unauthorized.status = 401;
    return next(unauthorized);
  }
};
