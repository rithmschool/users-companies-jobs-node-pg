const express = require('express');
const router = express.Router();
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
      'INSERT INTO users (first_name,last_name,email,photo) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.body.firstName, req.body.lastName, req.body.email, req.body.photo]
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
      'UPDATE users SET first_name=($1), last_name=($2), email=($3), photo=($4) WHERE id=($5) RETURNING *',
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.photo,
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
