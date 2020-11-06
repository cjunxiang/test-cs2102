const pool = require('./index.js');

const getFullTimeCareTaker = (request, response) => {
  pool.query('SELECT * FROM full_time_care_taker', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createFullTimeCareTaker = (request, response) => {
  const { email } = request.body;
  pool.query('INSERT INTO full_time_care_taker (email) VALUES ($1)', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Full Time CareTaker added with email: ${email}`);
  });
};

const deleteFullTimeCareTaker = (request, response) => {
  const { email } = request.params;

  pool.query('DELETE FROM full_time_care_taker WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Full Time CareTaker deleted with email: ${email}`);
  });
};

module.exports = {
  getFullTimeCareTaker,
  createFullTimeCareTaker,
  deleteFullTimeCareTaker
};
