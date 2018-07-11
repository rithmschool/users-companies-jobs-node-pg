const { getIdFromToken, authRequired } = require('../middleware/auth');
const { SECRET } = require('../config');
const bcrypt = require('bcrypt');
const db = require('../db');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/auth', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // try to find the user first
    const result = await db.query(
      'SELECT * FROM users WHERE username=$1 LIMIT 1',
      [req.body.username]
    );
    const foundUser = result.rows[0];
    if (!foundUser) {
      const userNotFound = new Error(`User '${username}' does not exist.`);
      userNotFound.status = 404;
      return next(userNotFound);
    }
    // if the user exists, let's compare their hashed password to a new hash from req.body.password
    const hashedPassword = await bcrypt.compare(password, foundUser.password);
    // bcrypt.compare returns a boolean to us, if it is false the passwords did not match!
    if (hashedPassword === false) {
      const invalidPass = new Error('Invalid Password');
      invalidPass.status = 401;
      return next(invalidPass);
    }
    const token = jwt.sign({ user_id: foundUser.id }, SECRET);
    return res.json({ token });
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password, first_name, last_name, email, photo, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        req.body.username,
        hashedPassword,
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.photo,
        req.body.company_id
      ]
    );
    const newUser = result.rows[0];
    return res.json(newUser);
  } catch (e) {
    return next(e);
  }
});

router.get('/', authRequired, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, username, first_name, last_name, photo, company_id FROM users'
    );
    const users = result.rows;
    return res.json(users);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userQuery = await db.query(
      'SELECT id, username, first_name, last_name, photo, company_id FROM users WHERE id=$1',
      [id]
    );
    const user = userQuery.rows[0];
    const jobsQuery = await db.query(
      'SELECT job_id FROM jobs_users WHERE user_id=$1',
      [id]
    );
    user.jobs = jobsQuery.rows.map(j => j.job_id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', getIdFromToken, async (req, res, next) => {
  try {
    if (req.params.id !== req.user_id) {
      const unauthorized = new Error('You are not allowed to edit this user.');
      unauthorized.status = 403;
      return next(unauthorized);
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query(
      'UPDATE users SET first_name=($1), last_name=($2), email=($3), photo=($4),company_id=($5), username=($6), password=($7) WHERE id=($8) RETURNING *',
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.photo,
        req.body.company_id,
        req.body.username,
        hashedPassword,
        req.params.id
      ]
    );
    const updatedUser = result.rows[0];
    return res.json(updatedUser);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', getIdFromToken, async function(req, res, next) {
  try {
    if (req.params.id != req.user_id) {
      const unauthorized = new Error('You are not allowed to edit this user.');
      unauthorized.status = 403;
      return next(unauthorized);
    }
    const result = await db.query('DELETE FROM users WHERE id=$1', [
      req.params.id
    ]);
    const deletedUser = result.rows[0];
    return res.json(deletedUser);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
