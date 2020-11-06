const pool = require('./index.js');

const getUsers = (request, response) => {
  pool.query('SELECT * FROM system_users', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserByEmail = (request, response) => {
  const { email } = request.params;

  pool.query('SELECT * FROM system_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { name, password, email } = request.body;
  pool.query(
    'INSERT INTO system_users (name, password, email) VALUES ($1, $2, $3)',
    [name, password, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User added with email11: ${email}`);
    }
  );
};

const updateUser = (request, response) => {
  const old_email = request.params.email;
  const { name, password, email } = request.body;

  pool.query(
    'UPDATE system_users SET name = $1, password = $2, email = $3 WHERE email = $4',
    [name, password, email, old_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with email: ${email}`);
    }
  );
};

const deleteUser = (request, response) => {
  const { email } = request.params;

  pool.query('DELETE FROM system_users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with email: ${email}`);
  });
};

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};
