const pool = require('./index.js');

const getFreeDays = (request, response) => {
  pool.query('SELECT * FROM is_free_on', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getFreeDaysByCaretaker= (request, response) => {
  const { email } = request.params;
  pool.query('SELECT * FROM is_free_on WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createFreeDay = (request, response) => {
  const { email, free_date } = request.body;
  pool.query(
    'INSERT INTO is_free_on (email, free_date) VALUES ($1,$2)',
    [email, free_date],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Availability recorded: ${email}, ${free_date}`);
    }
  );
};

const deleteFreeDay = (request, response) => {
  const { email, free_date } = request.params;

  pool.query(
    'DELETE FROM is_free_on WHERE email = $1 AND free_date = $2',
    [email, free_date],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Availability deleted: ${email}, ${free_date}`);
    }
  );
};

const getAvailablePartTimeCareTaker = (request, response) => {
  const { start_date, end_date } = request.params;

  pool.query('SELECT DISTINCT email FROM is_free_on WHERE free_date >= $1 AND free_date <= $2 GROUP BY email HAVING COUNT(*) >= date($2) - date($1) + 1', [start_date, end_date], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getFreeDays,
  getFreeDaysByCaretaker,
  createFreeDay,
  deleteFreeDay,
  getAvailablePartTimeCareTaker
};
