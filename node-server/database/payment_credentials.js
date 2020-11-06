const pool = require('./index.js');

const getPaymentCredentials = (request, response) => {
  pool.query('SELECT * FROM payment_credentials', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getPaymentCredentialsByEmail = (request, response) => {
  const { email } = request.params;

  pool.query('SELECT * FROM payment_credentials WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createPaymentCredentials = (request, response) => {
  const { email, credit_card_number, credit_card_expiry } = request.body;
  pool.query(
    'INSERT INTO payment_credentials (email, credit_card_number, credit_card_expiry) VALUES ($1, $2, $3)',
    [email, credit_card_number, credit_card_expiry],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Payment credentials added with email: ${email}`);
    }
  );
};

const updatePaymentCredentials = (request, response) => {
  const old_email = request.params.email;
  const old_credit_card_number = request.params.credit_card_number;
  const { email, credit_card_number, credit_card_expiry } = request.body;

  pool.query(
    'UPDATE payment_credentials SET email = $1, credit_card_number = $2, credit_card_expiry = $3  WHERE email = $4 AND credit_card_number = $5',
    [email, credit_card_number, credit_card_expiry, old_email, old_credit_card_number],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Payment credentials modified with email, number and expiry: ${
            (email, credit_card_number, credit_card_expiry)
          }`
        );
    }
  );
};

const deletePaymentCredentials = (request, response) => {
  const { email } = request.params;
  const { credit_card_number } = request.params;
  const { credit_card_expiry } = request.params;

  pool.query(
    'DELETE FROM payment_credentials WHERE email = $1 AND credit_card_number = $2 AND credit_card_expiry = $3',
    [email, credit_card_number, credit_card_expiry],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Payment credentials deleted with email, number and expiry: ${
            (email, credit_card_number, credit_card_expiry)
          }`
        );
    }
  );
};

module.exports = {
  getPaymentCredentials,
  getPaymentCredentialsByEmail,
  createPaymentCredentials,
  updatePaymentCredentials,
  deletePaymentCredentials
};
