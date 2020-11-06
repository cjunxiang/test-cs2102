const pool = require('./index.js');

const getBusyDays = (request, response) => {
  pool.query('SELECT * FROM is_unavailable_on', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getBusyDaysByCaretaker= (request, response) => {
  const { email } = request.params;
  pool.query('SELECT * FROM is_unavailable_on WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createBusyDay = (request, response) => {
  const { email, unavailable_date } = request.body;
  pool.query(
    'INSERT INTO is_unavailable_on (email, unavailable_date) VALUES ($1,$2)',
    [email, unavailable_date],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Unavailability recorded: ${email}, ${unavailable_date}`);
    }
  );
};

const deleteBusyDay = (request, response) => {
  const { email, unavailable_date } = request.params;

  pool.query(
    'DELETE FROM is_unavailable_on WHERE email = $1 AND unavailable_date = $2',
    [email, unavailable_date],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Unavailability deleted: ${email}, ${unavailable_date}`);
    }
  );
};

const getAvailableFullTimeCareTaker = (request, response) => {
  const { start_date, end_date } = request.params;

  pool.query('SELECT * FROM full_time_care_taker EXCEPT SELECT email FROM is_unavailable_on WHERE unavailable_date >= $1 AND unavailable_date <= $2', [start_date, end_date], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getBusyDays,
  getBusyDaysByCaretaker,
  createBusyDay,
  deleteBusyDay,
  getAvailableFullTimeCareTaker
};
