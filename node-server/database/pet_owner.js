const can_take_care = require('./can_take_care.js');
const pool = require('./index.js');

const getPetOwners = (request, response) => {
  pool.query('SELECT * FROM pet_owner', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getPetOwnerByEmail = (request, response) => {
  const { email } = request.params;

  pool.query('SELECT * FROM pet_owner WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createPetOwner = (request, response) => {
  const { email } = request.body;
  pool.query('INSERT INTO pet_owner (email) VALUES ($1)', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Pet Owner added with email: ${email}`);
  });
};

const deletePetOwner = (request, response) => {
  const { email } = request.params;

  pool.query('DELETE FROM pet_owner WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`PetOwner deleted with email: ${email}`);
  });
};

// Get full time care takers who are not on leave on any days within the given date range
// and is not taking care of more than 5 pets currently
// AND part time care takers who are available throughout the given date range
// and is not taking care of more than 2 pets currently for those with rating < 4
// or is not taking care of more than 5 pets currently
const getAvailableCareTakersByDateRange = (request, response) => {
  const { start_date, end_date, pet_name } = request.params;

  pool.query('SELECT care_taker_email FROM can_take_care, ((SELECT * FROM full_time_care_taker EXCEPT (SELECT email FROM is_unavailable_on WHERE unavailable_date >= $1 AND unavailable_date <= $2) EXCEPT (SELECT DISTINCT pet_count.care_taker_email FROM (SELECT day::date FROM   generate_series($1::timestamp, $2::timestamp, $3::interval) day) as list_of_all_days, (SELECT care_taker_email, day, count(pet_name) as num_of_pets FROM is_taking_care GROUP BY day, care_taker_email) as pet_count WHERE list_of_all_days.day = pet_count.day AND pet_count.num_of_pets > 4)) UNION SELECT email FROM (SELECT email, COUNT(free_date) FROM is_free_on WHERE free_date >= $1 AND free_date <= $2 GROUP BY email) as my_result WHERE my_result.count = (date($2) - date($1) + 1) EXCEPT (SELECT DISTINCT ct_rating.care_taker_email FROM (SELECT care_taker_email, AVG(rating) AS avg_rating FROM bids WHERE success_status = $4 GROUP BY care_taker_email) AS ct_rating, (SELECT day::date FROM   generate_series($1::timestamp, $2::timestamp, $3::interval) day) as list_of_all_days, (SELECT care_taker_email, day, count(pet_name) as num_of_pets FROM is_taking_care GROUP BY day, care_taker_email) as pet_count WHERE ct_rating.care_taker_email = pet_count.care_taker_email AND list_of_all_days.day = pet_count.day AND ((ct_rating.avg_rating < 4 AND pet_count.num_of_pets > 1) OR ( pet_count.num_of_pets > 4)))) AS free_and_available_ct WHERE free_and_available_ct.email = can_take_care.care_taker_email AND can_take_care.pet_name = $5 ', [start_date, end_date, '1 day', 'SUCCESS', pet_name], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};      


module.exports = {
  getPetOwners,
  getPetOwnerByEmail,
  createPetOwner,
  deletePetOwner,
  getAvailableCareTakersByDateRange
};

