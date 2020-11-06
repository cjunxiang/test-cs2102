const pool = require('./index.js');

const getCareTaker = (request, response) => {
  pool.query('SELECT * FROM care_taker', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createCareTaker = (request, response) => {
  const { email } = request.body;
  pool.query('INSERT INTO care_taker (email) VALUES ($1)', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`CareTaker added with email: ${email}`);
  });
};

const deleteCareTaker = (request, response) => {
  const { email } = request.params;

  pool.query('DELETE FROM care_taker WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`CareTaker deleted with email: ${email}`);
  });
};

const getCareTakerTypeByEmail = (request, response) => {
	const { email } = request.params;
	
  pool.query('SELECT email FROM care_taker WHERE email IN (SELECT email FROM full_time_care_taker WHERE email = $1)', [email], (error, results) => {
    if (error) {
      throw error;
    }
	if (results.rows.length == 0){
		response.status(200).send("part-time caretaker");
	}
	else {
		response.status(200).send("full-time caretaker");
	}
  });
};

module.exports = {
  getCareTaker,
  createCareTaker,
  deleteCareTaker,
  getCareTakerTypeByEmail
};
