const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');
const { getIdFromToken, authRequired } = require('../middleware/auth');

router.get('/', authRequired, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM jobs');
    const jobs = result.rows;
    return res.json(jobs);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM jobs WHERE id=$1', [
      req.params.id
    ]);
    const job = result.rows[0];
    return res.json(job);
  } catch (err) {
    return next(err);
  }
});

router.post('/', getIdFromToken, async (req, res, next) => {
  try {
    if (!req.company_id) {
      const unauthorized = new Error(
        'You are not allowed to post job listings.'
      );
      unauthorized.status = 403;
      return next(unauthorized);
    }
    const result = await db.query(
      'INSERT INTO jobs (title, salary, equity, company_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.body.title, req.body.salary, req.body.equity, req.company_id]
    );
    const newJob = result.rows[0];
    return res.json(newJob);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', getIdFromToken, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM jobs WHERE id=$1', [
      req.params.id
    ]);
    const job = result.rows[0];

    if (job.company_id !== req.company_id) {
      const unauthorized = new Error(
        'You are not allowed to edit this job listing.'
      );
      unauthorized.status = 403;
      return next(unauthorized);
    }
    const result2 = await db.query(
      'UPDATE jobs SET title=($1), salary=($2), equity=($3),company_id=($4) WHERE id=($5) RETURNING *',
      [
        req.body.title,
        req.body.salary,
        req.body.equity,
        req.body.company_id,
        req.params.id
      ]
    );
    const updatedJob = result2.rows[0];
    return res.json(updatedJob);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', getIdFromToken, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM jobs WHERE id=$1', [
      req.params.id
    ]);

    const job = result.rows[0];

    if (job.company_id !== req.company_id) {
      const unauthorized = new Error(
        'You are not allowed to delete this job listing.'
      );
      unauthorized.status = 403;
      return next(unauthorized);
    }
    const result2 = await db.query('DELETE FROM jobs WHERE id=$1', [
      req.params.id
    ]);

    const deletedJob = result2.rows[0];
    return res.json(deletedJob);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
