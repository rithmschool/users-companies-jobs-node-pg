const { getIdFromToken, authRequired } = require('../middleware/auth');
const { SECRET } = require('../config');
const bcrypt = require('bcrypt');
const db = require('../db');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/auth', async (req, res, next) => {
  try {
    const { handle, password } = req.body;
    // try to find the user first
    const result = await db.query(
      'SELECT * FROM companies WHERE handle=$1 LIMIT 1',
      [req.body.handle]
    );
    const foundCompany = result.rows[0];
    if (!foundCompany) {
      const companyNotFound = new Error(`Company '${handle}' does not exist.`);
      companyNotFound.status = 404;
      return next(companyNotFound);
    }
    // if the user exists, let's compare their hashed password to a new hash from req.body.password
    const hashedPassword = await bcrypt.compare(
      password,
      foundCompany.password
    );
    // bcrypt.compare returns a boolean to us, if it is false the passwords did not match!
    if (hashedPassword === false) {
      const invalidPass = new Error('Invalid Password');
      invalidPass.status = 401;
      return next(invalidPass);
    }
    const token = jwt.sign({ company_id: foundCompany.id }, SECRET);
    return res.json({ token });
  } catch (e) {
    return next(e);
  }
});

router.get('/', authRequired, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM companies');
    const companies = result.rows;
    return res.json(companies);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const companyQuery = await db.query('SELECT * FROM companies WHERE id=$1', [
      req.params.id
    ]);
    const company = companyQuery.rows[0];
    const usersQuery = await db.query(
      'SELECT id FROM users WHERE company_id=$1',
      [req.params.id]
    );
    const jobsQuery = await db.query(
      'SELECT id FROM jobs WHERE company_id=$1',
      [req.params.id]
    );
    company.users = usersQuery.rows.map(u => u.id);
    company.jobs = jobsQuery.rows.map(j => j.id);
    return res.json(company);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query(
      'INSERT INTO companies (handle, password, name, logo) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.body.handle, hashedPassword, req.body.name, req.body.logo]
    );
    const newCompany = result.rows[0];
    return res.json(newCompany);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', getIdFromToken, async (req, res, next) => {
  try {
    if (req.params.id !== req.company_id) {
      const unauthorized = new Error(
        'You are not allowed to edit this company.'
      );
      unauthorized.status = 403;
      return next(unauthorized);
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query(
      'UPDATE companies SET name=($1), logo=($2), handle=($3), password=($4)  WHERE id=($5) RETURNING *',
      [
        req.body.name,
        req.body.logo,
        req.params.handle,
        hashedPassword,
        req.params.id
      ]
    );
    const updatedCompany = result.rows[0];
    return res.json(updatedCompany);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', getIdFromToken, async (req, res, next) => {
  try {
    if (req.params.id !== req.company_id) {
      const unauthorized = new Error(
        'You are not allowed to delete this company.'
      );
      unauthorized.status = 403;
      return next(unauthorized);
    }
    const deletedCompany = await db.query('DELETE FROM companies WHERE id=$1', [
      req.params.id
    ]);
    return res.json(deletedCompany);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
