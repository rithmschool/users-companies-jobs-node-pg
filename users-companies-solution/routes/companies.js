const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async function(req, res, next) {
  try {
    const results = await db.query('SELECT * FROM companies');
    const companies = results.rows;
    return res.json(companies);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const results = await db.query('SELECT * FROM companies WHERE id=$1', [
      req.params.id
    ]);
    const users = await db.query('SELECT * FROM users WHERE company_id=$1', [
      req.params.id
    ]);

    const company = results.rows[0];
    company.employees = users.rows;
    return res.json(company);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const result = await db.query(
      'INSERT INTO companies (name,logo) VALUES ($1,$2) RETURNING *',
      [req.body.name, req.body.logo]
    );
    const newCompany = result.rows[0];
    return res.json(newCompany);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', async function(req, res, next) {
  try {
    const result = await db.query(
      'UPDATE companies SET name=($1), logo=($2) WHERE id=($3) RETURNING *',
      [req.body.name, req.body.logo, req.params.id]
    );
    const updatedCompany = result.rows[0];
    return res.json(updatedCompany);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    const result = await db.query('DELETE FROM companies WHERE id=$1', [
      req.params.id
    ]);

    const deletedCompany = result.rows[0];
    return res.json(deletedCompany);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
