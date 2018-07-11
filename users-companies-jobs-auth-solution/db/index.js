const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://localhost/users-companies-jobs-auth-solution'
});

client.connect();

module.exports = client;
