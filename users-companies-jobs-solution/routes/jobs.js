const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");

router.get("/", async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM jobs");
    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM jobs WHERE id=$1", [
      req.params.id
    ]);
    return res.json(results.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function(req, res, next) {
  try {
    const result = await db.query(
      "INSERT INTO jobs (title,salary,equity, company_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.body.title, req.body.salary, req.body.equity, req.body.company_id]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function(req, res, next) {
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
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function(req, res, next) {
  try {
    const result = await db.query("DELETE FROM jobs WHERE id=$1", [
      req.params.id
    ]);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;