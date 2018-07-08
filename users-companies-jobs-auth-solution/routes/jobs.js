const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");
const { ensureCorrectCompany, authRequired } = require("../middleware/auth");

router.get("/", authRequired, async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM jobs");
    const jobs = results.rows;
    return res.json(jobs);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", authRequired, async function(req, res, next) {
  try {
    const result = await db.query("SELECT * FROM jobs WHERE id=$1", [
      req.params.id
    ]);
    const job = result.rows[0];
    return res.json(job);
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureCorrectCompany, async function(req, res, next) {
  try {
    const result = await db.query(
      "INSERT INTO jobs (title,salary,equity, company_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.body.title, req.body.salary, req.body.equity, req.body.company_id]
    );
    const newJob = result.rows[0];
    return res.json(newJob);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", ensureCorrectCompany, async function(req, res, next) {
  try {
    const result = await db.query(
      "UPDATE jobs SET title=($1), salary=($2), equity=($3),company_id=($4) WHERE id=($5) RETURNING *",
      [
        req.body.title,
        req.body.salary,
        req.body.equity,
        req.body.company_id,
        req.params.id
      ]
    );
    const updatedJob = result.rows[0];
    return res.json(updatedJob);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureCorrectCompany, async function(req, res, next) {
  try {
    const result = await db.query("DELETE FROM jobs WHERE id=$1", [
      req.params.id
    ]);
    const deletedJob = result.rows[0];
    return res.json(deletedJob);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
