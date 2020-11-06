const pool = require('./index.js');

/**
 * CREATE TABLE paychecks (
 payment_admin VARCHAR(50) REFERENCES pcs_admin(email),
 payment_addressee VARCHAR(50) REFERENCES care_taker(email),
 amount NUMERIC,
 date_of_issue DATE
 );

 */

/* TODO: check if updatePaycheck method necessary */

const getPaychecks = (request, response) => {
  pool.query('SELECT * FROM paychecks', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getPaychecksByName = (request, response) => {
  const { payment_addressee } = request.params;

  pool.query(
    'SELECT * FROM paychecks WHERE payment_addressee = $1',
    [payment_addressee],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPaychecksByPcsAdmin = (request, response) => {
  const { payment_admin } = request.params;

  pool.query('SELECT * FROM paychecks WHERE payment_admin = $1', [payment_admin], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPaychecksByMonthAndYear = (request, response) => {
  const { month_of_issue } = request.params;
  const { year_of_issue } = request.params;

  pool.query(
    'SELECT * FROM paychecks WHERE month_of_issue = $1 AND year_of_issue = $2' ,
    [month_of_issue, year_of_issue],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createPaycheck = (request, response) => {
  const { payment_admin, payment_addressee, amount, date_of_issue } = request.body;
  pool.query(
    'INSERT INTO paychecks (payment_admin, payment_addressee, amount, date_of_issue) VALUES ($1, $2, $3, $4)',
    [payment_admin, payment_addressee, amount, date_of_issue],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `New paycheck created:\n Payment made to: ${payment_addressee}\n Amount: ${amount}\n Date of payment: ${date_of_issue}\n Authorised by: ${payment_admin}`
        );
    }
  );
};

const deletePaycheck = (request, response) => {
  const { payment_addressee, date_of_issue } = request.params;

  pool.query(
    'DELETE FROM paychecks WHERE payment_addressee = $1 AND date_of_issue = $2',
    [payment_addressee, date_of_issue],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Paycheck deleted: ${payment_addressee}, ${date_of_issue}`);
    }
  );
};

module.exports = {
  getPaychecks,
  getPaychecksByName,
  getPaychecksByPcsAdmin,
  getPaychecksByMonthAndYear,
  createPaycheck,
  deletePaycheck
};
