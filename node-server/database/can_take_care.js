const pool = require('./index.js');

const getCanTakeCare = (request, response) => {
  pool.query('SELECT * FROM can_take_care', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCanTakeCareByCaretaker = (request, response) => {
  const { care_taker_email } = request.params;

  pool.query(
    'SELECT * FROM can_take_care WHERE care_taker_email = $1',
    [care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createCanTakeCare = (request, response) => {
  const { care_taker_email, pet_owner_email, pet_name, daily_price } = request.body;
  pool.query(
    'INSERT INTO can_take_care (care_taker_email, pet_owner_email, pet_name, daily_price) VALUES ($1, $2, $3, $4)',
    [care_taker_email, pet_owner_email, pet_name, daily_price],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Takes Care added with careTaker email: ${care_taker_email}, \n petOwner email: ${pet_owner_email}`
        );
    }
  );
};

const updateCanTakeCare = (request, response) => {
  const { pet_owner_email } = request.params;
  const { care_taker_email } = request.params;
  const { pet_name } = request.params;
  const { daily_price } = request.body;

  pool.query(
    'UPDATE can_take_care SET daily_price = $1 WHERE pet_name = $2 AND pet_owner_email = $3 AND care_taker_email = $4',
    [daily_price, pet_name, pet_owner_email, care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Price modified with daily price of: ${daily_price}`);
    }
  );
};

const deleteCanTakeCare = (request, response) => {
  const { pet_owner_email, pet_name, care_taker_email } = request.params;

  pool.query(
    'DELETE FROM can_take_care WHERE pet_name = $1 AND pet_owner_email = $2 AND care_taker_email = $3',
    [pet_name, pet_owner_email, care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Pet deleted with pet name: ${pet_name} and owner's email ${pet_owner_email} with careTaker ${care_taker_email}`
        );
    }
  );
};

module.exports = {
  getCanTakeCare,
  getCanTakeCareByCaretaker,
  createCanTakeCare,
  updateCanTakeCare,
  deleteCanTakeCare
};
