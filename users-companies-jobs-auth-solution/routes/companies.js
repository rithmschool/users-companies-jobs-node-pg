const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const { ensureCorrectCompany, authRequired } = require("../middleware/auth");

router.get("/auth", authRequired, async function(req, res, next) {
  try {
    // try to find the company first
    const foundCompany = await db.query(
      "SELECT * FROM users WHERE handle=$1 LIMIT 1",
      [req.body.handle]
    );
    if (foundCompany.rows.length === 0) {
      return res.json({ message: "Invalid Handle" });
    }
    // if the company exists, let's compare their hashed password to a new hash from req.body.password
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      foundCompany.rows[0].password
    );
    // bcrypt.compare returns a boolean to us, if it is false the passwords did not match!
    if (hashedPassword === false) {
      return res.json({ message: "Invalid Password" });
    }
    return res.json({ message: "Logged In!" });
  } catch (e) {
    return res.json(e);
  }
});

router.get("/", authRequired, async function(req, res, next) {
  try {
    const companies = await db.query("SELECT * FROM companies");
    return res.json(companies.rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", authRequired, async function(req, res, next) {
  try {
    const companies = await db.query("SELECT * FROM companies WHERE id=$1", [
      req.params.id
    ]);
    const users = await db.query("SELECT * FROM users WHERE company_id=$1", [
      req.params.id
    ]);
    const jobs = await db.query("SELECT * FROM jobs WHERE company_id=$1", [
      req.params.id
    ]);
    companies.rows[0].users = users.rows;
    companies.rows[0].jobs = jobs.rows;
    return res.json(companies.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.post("/", authRequired, async function(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query(
      "INSERT INTO companies (handle, password, name,logo) VALUES ($1,$2, $3, $4) RETURNING *",
      [req.body.handle, hashedPassword, req.body.name, req.body.logo]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", ensureCorrectCompany, async function(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query(
      "UPDATE companies SET name=($1), logo=($2), handle=($3), password=($4)  WHERE id=($5) RETURNING *",
      [
        req.body.name,
        req.body.logo,
        req.params.handle,
        hashedPassword,
        req.params.id
      ]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureCorrectCompany, async function(req, res, next) {
  try {
    const result = await db.query("DELETE FROM companies WHERE id=$1", [
      req.params.id
    ]);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
