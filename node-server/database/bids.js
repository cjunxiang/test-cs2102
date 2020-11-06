const can_take_care = require('./can_take_care.js');
const { end } = require('./index.js');
const pool = require('./index.js');

const getBids = (request, response) => {
  pool.query('SELECT * FROM bids', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getBidByBoth = (request, response) => {
  const { pet_owner_email } = request.params;
  const { care_taker_email } = request.params;

  pool.query(
    'SELECT * FROM bids WHERE pet_owner_email = $1 AND care_taker_email = $2',
    [pet_owner_email, care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getBidByPetOwnerEmailSuccess = (request, response) => {
  const { pet_owner_email } = request.params;
  pool.query(
    'SELECT * FROM bids WHERE pet_owner_email = $1 AND success_status = $2',
    [pet_owner_email, 'SUCCESS'],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getBidByCareTakerEmailSuccess = (request, response) => {
  const { care_taker_email } = request.params;
  pool.query(
    'SELECT * FROM bids WHERE care_taker_email = $1 AND success_status = $2',
    [care_taker_email, 'SUCCESS'],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createBid = (request, response) => {
  const {
    pet_owner_email,
    care_taker_email,
    pet_name,
    success_status,
    start_date,
    end_date,
    price,
    review,
    rating,
    payment_method,
    delivery_method
  } = request.body;
  pool.query(
    'INSERT INTO bids (pet_owner_email, care_taker_email, pet_name, success_status, start_date, end_date, price, review, rating, payment_method, delivery_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11)',
    [
      pet_owner_email,
      care_taker_email,
      pet_name,
      success_status,
      start_date,
      end_date,
      price,
      review,
      rating,
      payment_method,
      delivery_method
    ],    (error, results) => {
      if (error) {
        throw error;
      }
  response.status(200).send('Successfully Added Bids');
}
  );
};

const updateBid = (request, response) => {
  const {
    pet_owner_email,
    care_taker_email,
    pet_name,
    start_date,
    end_date,
    price
  } = request.params;

  const { rating, review, payment_method, delivery_method} = request.body;
  pool.query(
    'UPDATE bids SET review = $1, rating = $2, payment_method = $3, delivery_method = $4 WHERE care_taker_email = $5 AND pet_owner_email = $6 AND start_date = $7 AND end_date = $8 AND pet_name = $9 AND price = $10',
    [ review, rating, payment_method, delivery_method, care_taker_email, pet_owner_email, start_date, end_date, pet_name, price],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Bid updated with caretaker's email: ${care_taker_email}, petowner's email: ${pet_owner_email}, pet name: ${pet_name} with rating: ${rating} and review:${review}`
        );
    }
  );
};

const deleteBid = (request, response) => {
  const { pet_owner_email } = request.params;
  const { care_taker_email } = request.params;

  pool.query(
    'DELETE FROM bids WHERE pet_owner_email = $1 AND care_taker_email = $2',
    [pet_owner_email, care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Bid deleted with  caretaker's email: ${care_taker_email}, petowner's email: ${pet_owner_email}`
        );
    }
  );
};

// get total pet days for the caretaker.
const getMonthlyPetDaysByCaretaker = (request, response) => {
  const {care_taker_email} = request.params;
  pool.query(
    'SELECT count(*) AS monthly_pet_days, AVG(daily_price) AS avg_price, month, year FROM is_taking_care where care_taker_email = $1 GROUP BY month, year ORDER BY month',
    [care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// get expected salary for full time caretaker.
const getExpectedMonthlySalaryFullTime = (request, response) => {
  const { care_taker_email } = request.params;
  pool.query(
    'SELECT *, CASE WHEN monthly_pet_days > 60 THEN 3000 + 0.8 * (monthly_pet_days - 60) * avg_price ELSE 3000 END expected_salary FROM (SELECT count(*) AS monthly_pet_days, avg(daily_price) AS avg_price, month, year FROM is_taking_care where care_taker_email = $1 GROUP BY month, year ORDER BY month) AS a',
    [care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// get expected salary for full time caretaker.
const getExpectedMonthlySalaryPartTime = (request, response) => {
  const { care_taker_email } = request.params;
  pool.query(
    'SELECT month, year, monthly_pet_days * avg_price * 0.75 AS pay_to_care_taker, monthly_pet_days * avg_price * 0.25 AS pcs_admin_share FROM (SELECT count(*) AS monthly_pet_days, avg(daily_price) AS avg_price, month, year FROM is_taking_care where care_taker_email = $1 GROUP BY month, year ORDER BY month) AS b', 
    [care_taker_email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getReviewsByCareTaker = (request, response) => {
  const { care_taker_email } = request.params;

  pool.query(
    'SELECT review, rating FROM bids WHERE care_taker_email = $1', [care_taker_email], (error, results) => {
      if (error) {
        throw error;
      };
      response.status(200).json(results.rows);
    }
  );
};

const getReviewsByPetOwner = (request, response) => {
  const { pet_owner_email } = request.params;

  pool.query(
    'SELECT review, rating FROM bids WHERE pet_owner_email = $1', [pet_owner_email], (error, results) => {
      if (error) {
        throw error;
      };
      response.status(200).json(results.rows);
    }
  );
};

const getPetsBeingTakenCareOf = (request, response) => {
  const { care_taker_email, date } = request.params;

  pool.query(
    'SELECT pet_name FROM bids WHERE care_taker_email = $1 AND $2 >= start_date AND $2 <= end_date AND success_status = $3', [care_taker_email, date, 'SUCCESS'], (error, results) => {
      if (error) {
        throw error;
      };
      response.status(200).json(results.rows);
    }
  );
};


const getRecentTenSuccesfulBidsByPetOwner = (request, response) => {
  const { pet_owner_email} = request.params;

  pool.query(
    'SELECT * FROM bids WHERE pet_owner_email = $1 AND success_status = $2 ORDER BY start_date DESC LIMIT 10',
    [pet_owner_email, 'SUCCESS'], 
    (error, results) => {
      if (error) {
        throw error;
      };
      response.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getBids,
  getBidByBoth,
  getBidByPetOwnerEmailSuccess,
  getBidByCareTakerEmailSuccess,
  createBid,
  updateBid,
  deleteBid,
  getMonthlyPetDaysByCaretaker,
  getExpectedMonthlySalaryFullTime,
  getExpectedMonthlySalaryPartTime,
  getReviewsByCareTaker,
  getReviewsByPetOwner,
  getPetsBeingTakenCareOf,
  getRecentTenSuccesfulBidsByPetOwner
};
