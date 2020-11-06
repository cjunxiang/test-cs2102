const pool = require('./index.js');

const getPartTimeCareTaker = (request, response) => {
  pool.query('SELECT * FROM part_time_care_taker', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createPartTimeCareTaker = (request, response) => {
  const { email } = request.body;
  pool.query('INSERT INTO part_time_care_taker (email) VALUES ($1)', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Part Time CareTaker added with email: ${email}`);
  });
};

const deletePartTimeCareTaker = (request, response) => {
  const { email } = request.params;

  pool.query('DELETE FROM part_time_care_taker WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Part Time CareTaker deleted with email: ${email}`);
  });
};

module.exports = {
  getPartTimeCareTaker,
  createPartTimeCareTaker,
  deletePartTimeCareTaker
};
