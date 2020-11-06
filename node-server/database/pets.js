const pool = require('./index.js');

const getPets = (request, response) => {
  pool.query('SELECT * FROM pets_owns', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getPetsByOwner = (request, response) => {
  const { pet_owner_email } = request.params;

  pool.query(
    'SELECT * FROM pets_owns WHERE pet_owner_email = $1',
    [pet_owner_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createPet = (request, response) => {
  const { pet_name, pet_owner_email, category, profile, special_requirements } = request.body;
  pool.query(
    'INSERT INTO pets_owns (pet_name, pet_owner_email, category, profile, special_requirements) VALUES ($1, $2, $3, $4, $5)',
    [pet_name, pet_owner_email, category, profile, special_requirements],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Pet added with name: ${pet_name}`);
    }
  );
};

const updatePet = (request, response) => {
  const old_pet_owner_email = request.params.pet_owner_email;
  const old_pet_name = request.params.pet_name;
  const { pet_name, category, special_requirements, profile } = request.body;

  pool.query(
    'UPDATE pets_owns SET pet_name = $1, category = $2, special_requirements = $3, profile = $4 WHERE pet_name = $5 AND pet_owner_email = $6',
    [pet_name, category, special_requirements, profile, old_pet_name, old_pet_owner_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Pet modified with name: ${pet_name}`);
    }
  );
};

const deletePet = (request, response) => {
  const { pet_owner_email } = request.params;
  const { pet_name } = request.params;

  pool.query(
    'DELETE FROM pets_owns WHERE pet_name = $1 AND pet_owner_email = $2',
    [pet_name, pet_owner_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`Pet deleted with pet name: ${pet_name} and owner's email ${pet_owner_email}`);
    }
  );
};

module.exports = {
  getPets,
  getPetsByOwner,
  createPet,
  updatePet,
  deletePet
};
