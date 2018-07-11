process.env.NODE_ENV = 'test';
const db = require('../db');
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// global auth variable to store things for all the tests
const auth = {};

beforeAll(async () => {
  await db.query(
    'CREATE TABLE companies (id SERIAL PRIMARY KEY, handle TEXT UNIQUE NOT NULL, password TEXT NOT NULL, name TEXT, logo TEXT )'
  );

  await db.query(
    `CREATE TABLE jobs (id SERIAL PRIMARY KEY, title TEXT, salary TEXT, equity FLOAT, company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE)`
  );

  await db.query(`CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  photo TEXT,
  company_id INTEGER REFERENCES companies (id) ON DELETE SET NULL
)`);

  await db.query(`CREATE TABLE jobs_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES companies (id) ON DELETE CASCADE
)`);
});

beforeEach(async () => {
  // login a user, get a token, store the user ID and token
  const hashedPassword = await bcrypt.hash('secret', 1);
  await db.query("INSERT INTO users (username, password) VALUES ('test', $1)", [
    hashedPassword
  ]);
  const response = await request(app)
    .post('/users/auth')
    .send({
      username: 'test',
      password: 'secret'
    });
  auth.token = response.body.token;
  auth.current_user_id = jwt.decode(auth.token).user_id;

  // do the same for company "companies"
  const hashedCompanyPassword = await bcrypt.hash('secret', 1);
  await db.query(
    "INSERT INTO companies (handle, password) VALUES ('testcompany', $1)",
    [hashedCompanyPassword]
  );
  const companyResponse = await request(app)
    .post('/companies/auth')
    .send({
      handle: 'testcompany',
      password: 'secret'
    });
  auth.company_token = companyResponse.body.token;
  auth.current_company_id = jwt.decode(auth.company_token).company_id;
});

describe('GET /users', () => {
  test('gets a list of 1 user', async () => {
    const response = await request(app)
      .get('/users')
      .set('authorization', auth.token);
    expect(response.body).toHaveLength(1);
  });
});

describe('DELETE /users/:id', () => {
  test('successfully deletes own user', async () => {
    const response = await request(app)
      .delete(`/users/${auth.current_user_id}`)
      .set('authorization', auth.token);
    expect(response.status).toBe(200);
  });
  test('cannot delete other user', async () => {
    const response = await request(app)
      .delete(`/users/${auth.current_user_id + 1}`)
      .set('authorization', auth.token);
    expect(response.status).toBe(403);
  });
});

describe('PATCH /companies/:id', () => {
  test('successfully updates own company', async () => {
    const response = await request(app)
      .patch(`/companies/${auth.current_company_id}`)
      .send({
        handle: 'testcompany',
        password: 'secret',
        name: 'Hooli'
      })
      .set('authorization', auth.company_token);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Hooli');
  });
});

afterEach(async () => {
  // delete the users and company users
  await db.query('DELETE FROM users');
  await db.query('DELETE FROM companies');
});

afterAll(async () => {
  await db.query('DROP TABLE IF EXISTS jobs_users');
  await db.query('DROP TABLE IF EXISTS jobs');
  await db.query('DROP TABLE IF EXISTS users');
  await db.query('DROP TABLE IF EXISTS companies');
  db.end();
});
