const { Client } = require("pg");
const client = new Client({
  connectionString: "postgresql://localhost/users-companies-jobs-solution"
});

client.connect();

module.exports = client;
