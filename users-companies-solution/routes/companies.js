const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM companies");
    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM companies WHERE id=$1", [
      req.params.id
    ]);
    const users = await db.query("SELECT * FROM users WHERE company_id=$1", [
      req.params.id
    ]);
    console.log(users.rows);
    results.rows[0].users = users.rows;
    return res.json(results.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function(req, res, next) {
  try {
    const result = await db.query(
      "INSERT INTO companies (name,logo) VALUES ($1,$2) RETURNING *",
      [req.body.name, req.body.logo]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function(req, res, next) {
  try {
    const result = await db.query(
      "UPDATE companies SET name=($1), logo=($2) WHERE id=($3) RETURNING *",
      [req.body.name, req.body.logo, req.params.id]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function(req, res, next) {
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
