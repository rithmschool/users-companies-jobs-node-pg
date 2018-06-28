DROP DATABASE "users-solution";
CREATE DATABASE "users-solution";
\c "users-solution"
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    photo TEXT
);
\q