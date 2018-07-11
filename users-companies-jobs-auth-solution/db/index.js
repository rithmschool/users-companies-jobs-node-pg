const { Client } = require('pg');

let dbName = 'users-companies-jobs-auth-solution';
if (process.env.NODE_ENV === 'test') {
  dbName = 'users-companies-jobs-auth-solution-test';
}

const client = new Client({
  connectionString: `postgresql://localhost/${dbName}`
});

client.connect();

module.exports = client;
