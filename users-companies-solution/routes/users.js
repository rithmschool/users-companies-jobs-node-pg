const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

router.get('/', async function(req, res, next) {
  try {
    const results = await db.query('SELECT * FROM users');
    const users = results.rows;
    return res.json(users);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const results = await db.query('SELECT * FROM users WHERE id=$1', [
      req.params.id
    ]);
    const user = results.rows[0];
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const result = await db.query(
      'INSERT INTO users (first_name,last_name,email,photo, company_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.photo,
        req.body.company_id
      ]
    );

    const newUser = result.rows[0];
    return res.json(newUser);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', async function(req, res, next) {
  try {
    const result = await db.query(
      'UPDATE users SET first_name=($1), last_name=($2), email=($3), photo=($4),company_id=($5) WHERE id=($6) RETURNING *',
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.photo,
        req.body.company_id,
        req.params.id
      ]
    );
    const updatedUser = result.rows[0];
    return res.json(updatedUser);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async function(req, res, next) {
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
