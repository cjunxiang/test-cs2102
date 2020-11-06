require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.HEROKU_USER,
  host: process.env.HEROKU_HOST,
  database: process.env.HEROKU_DATABASE,
  password: process.env.HEROKU_PASSWORD,
  port: process.env.HEROKU_PORT,
  ssl: { rejectUnauthorized: false },
  sslmode: 'require'
});

module.exports = pool;
