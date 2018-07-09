const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');
const bcrypt = require('bcrypt');
const { ensureCorrectUser, authRequired } = require('../middleware/auth');

router.post('/auth', async (req, res, next) => {
  try {
    // try to find the user first
    const foundUser = await db.query(
      'SELECT * FROM users WHERE username=$1 LIMIT 1',
      [req.body.username]
    );
    if (foundUser.rows.length === 0) {
      return res.json({ message: 'Invalid Username' });
    }
    // if the user exists, let's compare their hashed password to a new hash from req.body.password
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      foundUser.rows[0].password
    );
    // bcrypt.compare returns a boolean to us, if it is false the passwords did not match!
    if (hashedPassword === false) {
      return res.json({ message: 'Invalid Password' });
    }
    return res.json({ message: 'Logged In!' });
  } catch (e) {
    return res.json(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password, first_name,last_name,email,photo, company_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
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
    return res.json(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', authRequired, async function(req, res, next) {
  try {
    const results = await db.query('SELECT * FROM users WHERE id=$1', [
      req.params.id
    ]);
    const jobs = await db.query(
      'SELECT job_id FROM jobs_users WHERE user_id=$1',
      [req.params.id]
    );
    const user = results.rows[0];
    user.users = jobs.rows;
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', ensureCorrectUser, async function(req, res, next) {
  try {
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

router.delete('/:id', ensureCorrectUser, async function(req, res, next) {
  try {
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
