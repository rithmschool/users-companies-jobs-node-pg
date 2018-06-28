DROP DATABASE "users-companies-solution";
CREATE DATABASE "users-companies-solution";
\c "users-companies-solution"
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT,
    logo TEXT
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    photo TEXT,
    company_id INTEGER REFERENCES companies (id) ON DELETE CASCADE
);
\q