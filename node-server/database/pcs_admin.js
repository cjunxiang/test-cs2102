const pool = require('./index.js');

const getPcsAdmin = (request, response) => {
  pool.query('SELECT * FROM pcs_admin', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createPcsAdmin = (request, response) => {
  const { email } = request.body;
  pool.query('INSERT INTO pcs_admin (email) VALUES ($1)', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Pcs Admin added with email: ${email}`);
  });
};

const deletePcsAdmin = (request, response) => {
  const { email } = request.params;

  pool.query('DELETE FROM pcs_admin WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`PcsAdmin deleted with email: ${email}`);
  });
};

module.exports = {
  getPcsAdmin,
  createPcsAdmin,
  deletePcsAdmin
};
