const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");

router.get("/", async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM users");
    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM users WHERE id=$1", [
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
      "INSERT INTO users (first_name,last_name,email,photo, company_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.photo,
        req.body.company_id
      ]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function(req, res, next) {
  try {
    const result = await db.query(
      "UPDATE users SET first_name=($1), last_name=($2), email=($3), photo=($4),company_id=($5) WHERE id=($6) RETURNING *",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.photo,
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
    const result = await db.query("DELETE FROM users WHERE id=$1", [
      req.params.id
    ]);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
