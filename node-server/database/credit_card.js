const pool = require('./index.js');

const getCreditCard = (request, response) => {
  pool.query('SELECT * FROM credit_card', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCreditCardByName = (request, response) => {
  const { credit_card_name } = request.params;

  pool.query(
    'SELECT * FROM credit_card WHERE credit_card_name = $1',
    [credit_card_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createCreditCard = (request, response) => {
  const { credit_card_number, credit_card_expiry, credit_card_name } = request.body;
  pool.query(
    'INSERT INTO credit_card (credit_card_number, credit_card_expiry, credit_card_name) VALUES ($1, $2, $3)',
    [credit_card_number, credit_card_expiry, credit_card_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Credit card added with number, expiry and name: ${
            (credit_card_number, credit_card_expiry, credit_card_name)
          }`
        );
    }
  );
};

const updateCreditCard = (request, response) => {
  const old_credit_card_number = request.params.credit_card_number;
  const old_credit_card_expiry = request.params.credit_card_expiry;
  const { credit_card_number, credit_card_expiry, credit_card_name } = request.body;

  pool.query(
    'UPDATE credit_card SET credit_card_number = $1, credit_card_expiry = $2, credit_card_name = $3 WHERE credit_card_number = $4 AND credit_card_expiry = $5',
    [
      credit_card_number,
      credit_card_expiry,
      credit_card_name,
      old_credit_card_number,
      old_credit_card_expiry
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Credit card details modified with number and expiry: ${
            (credit_card_number, credit_card_expiry)
          }`
        );
    }
  );
};

const deleteCreditCard = (request, response) => {
  const { credit_card_number } = request.params;
  const { credit_card_expiry } = request.params;

  pool.query(
    'DELETE FROM credit_card WHERE credit_card_number = $1 AND credit_card_expiry = $2',
    [credit_card_number, credit_card_expiry],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Credit card deleted with number and expiry: ${(credit_card_number, credit_card_expiry)}`
        );
    }
  );
};

module.exports = {
  getCreditCard,
  getCreditCardByName,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard
};
