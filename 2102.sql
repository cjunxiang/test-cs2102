/* IMPORTANT: date objects in format MM/DD/YYYY! */

DROP TABLE IF EXISTS system_users CASCADE;
DROP TABLE IF EXISTS credit_card CASCADE;
DROP TABLE IF EXISTS payment_credentials CASCADE;
DROP TABLE IF EXISTS pet_owner CASCADE;
DROP TABLE IF EXISTS pcs_admin CASCADE;
DROP TABLE IF EXISTS care_taker CASCADE;
DROP TABLE IF EXISTS paychecks CASCADE;
DROP TABLE IF EXISTS availabilities CASCADE;
DROP TABLE IF EXISTS unavailabilities CASCADE;
DROP TABLE IF EXISTS is_unavailable_on CASCADE;
DROP TABLE IF EXISTS is_free_on CASCADE;
DROP TABLE IF EXISTS pets_owns CASCADE;
DROP TABLE IF EXISTS can_take_care CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS full_time_care_taker CASCADE;
DROP TABLE IF EXISTS part_time_care_taker CASCADE;

CREATE TABLE system_users(
    email VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    name VARCHAR(50)
);

CREATE TABLE credit_card (
	credit_card_number VARCHAR(50),
	credit_card_expiry VARCHAR(50),
	credit_card_name VARCHAR(50),
	PRIMARY KEY (credit_card_number, credit_card_expiry)
);

CREATE TABLE payment_credentials (
	email VARCHAR(50) REFERENCES system_users(email),
	credit_card_number VARCHAR(50),
	credit_card_expiry VARCHAR(50),
	FOREIGN KEY (credit_card_number, credit_card_expiry) REFERENCES credit_card(credit_card_number, credit_card_expiry),
	PRIMARY KEY (email, credit_card_number, credit_card_expiry)
);

CREATE TABLE pet_owner(
    email VARCHAR(50) PRIMARY KEY REFERENCES system_users(email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE care_taker(
    email VARCHAR(50) PRIMARY KEY REFERENCES system_users(email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE pcs_admin(
    email VARCHAR(50) PRIMARY KEY REFERENCES system_users(email) ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE TABLE full_time_care_taker(
    email VARCHAR(50) PRIMARY KEY REFERENCES care_taker(email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE part_time_care_taker(
    email VARCHAR(50) PRIMARY KEY REFERENCES care_taker(email) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE paychecks (
	payment_admin VARCHAR(50) REFERENCES pcs_admin(email),
	payment_addressee VARCHAR(50) REFERENCES care_taker(email),
	amount NUMERIC,
	month_of_issue VARCHAR(10),
	year_of_issue VARCHAR(5)
);

CREATE TABLE pets_owns(
    pet_name VARCHAR(50) NOT NULL,
    pet_owner_email VARCHAR(50) NOT NULL REFERENCES pet_owner(email) ON DELETE CASCADE,
    special_requirements VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    profile VARCHAR(500) NOT NULL,
    PRIMARY KEY (pet_name, pet_owner_email)
);

CREATE TABLE can_take_care(
    care_taker_email VARCHAR(50) NOT NULL REFERENCES care_taker(email),
    pet_owner_email VARCHAR(50),
    pet_name VARCHAR(50),
    daily_price INTEGER,
    PRIMARY KEY (care_taker_email, pet_owner_email, pet_name),
    FOREIGN KEY (pet_owner_email, pet_name) REFERENCES pets_owns(pet_owner_email, pet_name)
);

CREATE TABLE is_taking_care(
    care_taker_email VARCHAR(50) NOT NULL REFERENCES care_taker(email),
    pet_owner_email VARCHAR(50),
    pet_name VARCHAR(50),
    daily_price INTEGER,
    day DATE NOT NULL,
    month INTEGER,
    year NUMERIC, 
    PRIMARY KEY (care_taker_email, pet_owner_email, pet_name, day),
    FOREIGN KEY (care_taker_email, pet_owner_email, pet_name) REFERENCES can_take_care(care_taker_email, pet_owner_email, pet_name)
);

CREATE TABLE bids (
    pet_owner_email VARCHAR NOT NULL REFERENCES pet_owner(email),
    care_taker_email VARCHAR NOT NULL REFERENCES care_taker(email),
    pet_name VARCHAR NOT NULL,
    success_status VARCHAR NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price INTEGER,
    rating INTEGER NOT NULL CHECK (rating < 6), 
    review VARCHAR,
    payment_method VARCHAR,
    delivery_method VARCHAR, 
    PRIMARY KEY (pet_owner_email, care_taker_email, pet_name, price, start_date, end_date)
);

CREATE TABLE is_unavailable_on(
	email VARCHAR(50) REFERENCES full_time_care_taker(email) ON DELETE CASCADE ON UPDATE CASCADE,
    unavailable_date DATE NOT NULL,
    PRIMARY KEY (email, unavailable_date)
);

CREATE TABLE is_free_on(
	email VARCHAR(50) REFERENCES part_time_care_taker(email) ON DELETE CASCADE ON UPDATE CASCADE,
    free_date DATE NOT NULL,
    PRIMARY KEY (email, free_date)
);

-- Triggers 
CREATE OR REPLACE FUNCTION only_pet_owner()
RETURNS TRIGGER AS 
$$ DECLARE ctx NUMERIC;
    BEGIN 
        SELECT COUNT(*) INTO ctx FROM (
            SELECT * FROM care_taker C 
                WHERE NEW.email = C.email
            UNION
            SELECT * FROM pcs_admin P 
                WHERE NEW.email = P.email ) AS combined;
        IF ctx > 0 THEN 
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_pet_owner 
BEFORE INSERT OR UPDATE ON pet_owner
FOR EACH ROW EXECUTE PROCEDURE only_pet_owner();

CREATE OR REPLACE FUNCTION only_care_taker()
RETURNS TRIGGER AS 
$$ DECLARE ctx NUMERIC;
    BEGIN 
        SELECT COUNT(*) INTO ctx FROM (
            SELECT * FROM pet_owner O 
                WHERE NEW.email = O.email
            UNION
            SELECT * FROM pcs_admin P 
                WHERE NEW.email = P.email ) AS combined;
        IF ctx > 0 THEN 
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_care_taker 
BEFORE INSERT OR UPDATE ON care_taker
FOR EACH ROW EXECUTE PROCEDURE only_care_taker();

CREATE OR REPLACE FUNCTION only_pcs_admin()
RETURNS TRIGGER AS 
$$ DECLARE ctx NUMERIC;
    BEGIN 
        SELECT COUNT(*) INTO ctx FROM (
            SELECT * FROM pet_owner O 
                WHERE NEW.email = O.email
            UNION
            SELECT * FROM care_taker C 
                WHERE NEW.email = C.email ) AS combined;
        IF ctx > 0 THEN 
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_pcs_admin 
BEFORE INSERT OR UPDATE ON pcs_admin
FOR EACH ROW EXECUTE PROCEDURE only_pcs_admin();

CREATE OR REPLACE FUNCTION full_time_care_taker()
RETURNS TRIGGER AS 
$$ DECLARE ctx NUMERIC;
    BEGIN 
        SELECT COUNT(*) INTO ctx FROM (
            SELECT * FROM part_time_care_taker O 
                WHERE NEW.email = O.email) AS foo;
        IF ctx > 0 THEN 
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_full_time 
BEFORE INSERT OR UPDATE ON full_time_care_taker
FOR EACH ROW EXECUTE PROCEDURE full_time_care_taker();

CREATE OR REPLACE FUNCTION part_time_care_taker()
RETURNS TRIGGER AS 
$$ DECLARE ctx NUMERIC;
    BEGIN 
        SELECT COUNT(*) INTO ctx FROM (
            SELECT * FROM full_time_care_taker O 
                WHERE NEW.email = O.email) AS foo;
        IF ctx > 0 THEN 
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_part_time 
BEFORE INSERT OR UPDATE ON part_time_care_taker
FOR EACH ROW EXECUTE PROCEDURE part_time_care_taker();

CREATE OR REPLACE FUNCTION approve_bid()
RETURNS TRIGGER AS
$$  
    DECLARE ft NUMERIC;
    DECLARE pt NUMERIC;
    DECLARE can_tc NUMERIC;
    DECLARE ctx NUMERIC;
    DECLARE caretaker_price INTEGER;
    DECLARE available NUMERIC; 
    DECLARE avg_rating NUMERIC;
    DECLARE curr_start_date DATE;
    DECLARE curr_month INTEGER;
    DECLARE curr_year NUMERIC;
    DECLARE bool BOOLEAN;
    BEGIN
        SELECT COUNT(*) INTO ft FROM full_time_care_taker WHERE NEW.care_taker_email = email;
        SELECT COUNT(*) INTO pt FROM part_time_care_taker WHERE NEW.care_taker_email = email;
        SELECT COUNT(*) INTO can_tc FROM can_take_care WHERE NEW.care_taker_email = care_taker_email AND NEW.pet_owner_email = pet_owner_email AND NEW.pet_name = pet_name;
        SELECT MAX(num_of_pets) AS curr_max INTO ctx
            FROM (
                SELECT COUNT(*) AS num_of_pets, day FROM is_taking_care 
                WHERE care_taker_email = NEW.care_taker_email GROUP BY day HAVING day >= NEW.start_date AND day <= NEW.end_date
            ) AS day_pets;
        
        SELECT daily_price INTO caretaker_price 
            FROM can_take_care 
            WHERE care_taker_email = NEW.care_taker_email AND pet_owner_email = NEW.pet_owner_email AND pet_name = NEW.pet_name;

        IF ft = 1 THEN
            SELECT COUNT(*) INTO available 
                FROM (
                    SELECT * FROM full_time_care_taker EXCEPT SELECT email FROM is_unavailable_on WHERE unavailable_date >= NEW.start_date AND unavailable_date <= NEW.end_date
                ) AS a WHERE NEW.care_taker_email = email;

            IF  (ctx is null OR ctx < 5) AND caretaker_price <= NEW.price AND available = 1 AND can_tc = 1 THEN
                UPDATE bids SET success_status = 'SUCCESS' WHERE care_taker_email = NEW.care_taker_email
                    AND pet_owner_email = NEW.pet_owner_email AND pet_name = NEW.pet_name AND start_date = NEW.start_date 
                    AND end_date = NEW.end_date AND price = NEW.price;
                SELECT NEW.start_date INTO curr_start_date;
                WHILE NEW.end_date >= curr_start_date
                    LOOP
                        SELECT EXTRACT(MONTH FROM curr_start_date) into curr_month;
                        SELECT EXTRACT(YEAR FROM curr_start_date) into curr_year;
                        INSERT INTO is_taking_care VALUES (NEW.care_taker_email, NEW.pet_owner_email, NEW.pet_name, NEW.price, curr_start_date, curr_month, curr_year);
                        SELECT curr_start_date + INTERVAL '1' DAY INTO curr_start_date;
                    END LOOP;
                RETURN NULL;
            ELSE 
            RETURN NULL;
            END IF;
        END IF;
        IF pt = 1 THEN
            SELECT COUNT(*) INTO available FROM (SELECT DISTINCT email FROM is_free_on WHERE free_date >= NEW.start_date AND free_date <= NEW.end_date GROUP BY email HAVING COUNT(*) >= date(NEW.end_date) - date(NEW.start_date) + 1) AS ptavail WHERE email = NEW.care_taker_email;
            SELECT AVG(rating) INTO avg_rating FROM bids WHERE care_taker_email = NEW.care_taker_email AND success_status = 'SUCCESS';
            SELECT (ctx is null) OR (avg_rating < 4 AND ctx < 2) OR (avg_rating > 3 AND ctx < 5) INTO bool;

            IF caretaker_price <= NEW.price AND available = 1 AND bool AND can_tc = 1 THEN
                UPDATE bids SET success_status = 'SUCCESS' WHERE care_taker_email = NEW.care_taker_email
                    AND pet_owner_email = NEW.pet_owner_email AND pet_name = NEW.pet_name AND start_date = NEW.start_date 
                    AND end_date = NEW.end_date AND price = NEW.price;
                SELECT NEW.start_date INTO curr_start_date;
                WHILE NEW.end_date >= curr_start_date
                    LOOP
                        SELECT EXTRACT(MONTH FROM curr_start_date) into curr_month;
                        SELECT EXTRACT(YEAR FROM curr_start_date) into curr_year;
                        INSERT INTO is_taking_care VALUES (NEW.care_taker_email, NEW.pet_owner_email, NEW.pet_name, NEW.price, curr_start_date, curr_month, curr_year);
                        SELECT curr_start_date + INTERVAL '1' DAY INTO curr_start_date;
                    END LOOP;
                RETURN NULL;
            ELSE 
            RETURN NULL;  
            END IF;
        END IF;
    END; $$
LANGUAGE plpgsql; 

CREATE TRIGGER approve_bid
AFTER INSERT ON bids
FOR EACH ROW EXECUTE PROCEDURE approve_bid();

CREATE OR REPLACE FUNCTION is_taking_care_of_pet()
RETURNS TRIGGER AS 
$$ DECLARE ctx NUMERIC;
    BEGIN 
        SELECT COUNT(*) INTO ctx FROM (
            SELECT * FROM is_taking_care TC 
                WHERE TC.day = NEW.unavailable_date AND TC.care_taker_email = NEW.email) as caretaker_current_pets;
            IF (ctx > 0) THEN 
                RETURN NULL;
            ELSE 
                RETURN NEW;
            END IF;
    END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_if_can_take_leave
BEFORE INSERT OR UPDATE ON is_unavailable_on
FOR EACH ROW EXECUTE PROCEDURE is_taking_care_of_pet();

-- Populate database
INSERT INTO system_users VALUES ('junhup@email.com', 'password', 'junhup');
INSERT INTO system_users VALUES ('pcsadmin@email.com', 'password', 'junhup');
INSERT INTO system_users VALUES ('pcsadmin2@email.com', 'password', 'junhup');
INSERT INTO system_users VALUES ('petowner@email.com', 'asdf', 'junhup');
INSERT INTO system_users VALUES ('caretaker@email.com', 'abc', 'junhup');
INSERT INTO system_users VALUES ('petowner1@email.com', 'asdf', 'junhup');
INSERT INTO system_users VALUES ('caretaker1@email.com', 'abc', 'junhup');
INSERT INTO system_users VALUES ('petowner2@email.com', 'password', 'junhup');
INSERT INTO system_users VALUES ('caretaker2@email.com', 'password', 'junhup');
INSERT INTO system_users VALUES ('petowner3@email.com', 'asdf', 'junhup');
INSERT INTO system_users VALUES ('caretaker3@email.com', 'abc', 'junhup');
INSERT INTO system_users VALUES ('petowner4@email.com', 'password', 'junhup');
INSERT INTO system_users VALUES ('caretaker4@email.com', 'password', 'junhup');
INSERT INTO system_users VALUES ('caretaker5@email.com', 'password', 'junhup1'); 

INSERT INTO pet_owner VALUES ('junhup@email.com');
INSERT INTO pet_owner VALUES ('petowner@email.com');
INSERT INTO pet_owner VALUES ('petowner1@email.com');
INSERT INTO pet_owner VALUES ('petowner2@email.com');
INSERT INTO pet_owner VALUES ('petowner3@email.com');
INSERT INTO pet_owner VALUES ('petowner4@email.com');

INSERT INTO care_taker VALUES ('caretaker@email.com');
INSERT INTO care_taker VALUES ('caretaker1@email.com');
INSERT INTO care_taker VALUES ('caretaker2@email.com');
INSERT INTO care_taker VALUES ('caretaker3@email.com');
INSERT INTO care_taker VALUES ('caretaker4@email.com');
INSERT INTO care_taker VALUES ('caretaker5@email.com');

INSERT INTO pcs_admin VALUES ('pcsadmin@email.com');
INSERT INTO pcs_admin VALUES ('pcsadmin2@email.com');

INSERT INTO full_time_care_taker VALUES ('caretaker@email.com');
INSERT INTO full_time_care_taker VALUES ('caretaker1@email.com');
INSERT INTO full_time_care_taker VALUES ('caretaker2@email.com');

INSERT INTO part_time_care_taker VALUES ('caretaker3@email.com');
INSERT INTO part_time_care_taker VALUES ('caretaker4@email.com');
INSERT INTO part_time_care_taker VALUES ('caretaker5@email.com'); 

INSERT INTO paychecks VALUES ('pcsadmin@email.com', 'caretaker4@email.com', '3000', 'October', '2020');
INSERT INTO paychecks VALUES ('pcsadmin@email.com', 'caretaker@email.com', '400', 'November', '2020');
INSERT INTO paychecks VALUES ('pcsadmin@email.com', 'caretaker3@email.com', '1000', 'December', '2020');
INSERT INTO paychecks VALUES ('pcsadmin2@email.com', 'caretaker3@email.com', '2000', 'December', '2020');
INSERT INTO paychecks VALUES ('pcsadmin2@email.com', 'caretaker@email.com', '7000', 'October', '2020');

INSERT INTO pets_owns VALUES ('alice', 'petowner@email.com', null, 'dog', 'profile1');
INSERT INTO pets_owns VALUES ('bob', 'petowner@email.com', null, 'dophin', 'profile1');
INSERT INTO pets_owns VALUES ('fat', 'petowner1@email.com', 'run', 'cat', 'profile1');
INSERT INTO pets_owns VALUES ('faty', 'petowner2@email.com', 'cheese', 'dog', 'profile1');
INSERT INTO pets_owns VALUES ('faty2', 'petowner2@email.com', 'cheese', 'dog', 'profile1');
INSERT INTO pets_owns VALUES ('faty3', 'petowner2@email.com', 'cheese', 'dog', 'profile1');
INSERT INTO pets_owns VALUES ('pop', 'petowner3@email.com', 'choc', 'pet', 'profile1');

INSERT INTO can_take_care VALUES ('caretaker@email.com', 'petowner@email.com', 'alice', '30');
INSERT INTO can_take_care VALUES ('caretaker@email.com', 'petowner@email.com', 'bob', '30');
INSERT INTO can_take_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty', '40');
INSERT INTO can_take_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty2', '40');
INSERT INTO can_take_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty3', '40');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'alice', '30');

INSERT INTO can_take_care VALUES ('caretaker1@email.com', 'petowner1@email.com', 'fat', '40');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner3@email.com', 'pop', '30');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty', '40');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty2', '40');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty3', '40');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'alice', '40');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'bob', '40');
INSERT INTO can_take_care VALUES ('caretaker2@email.com', 'petowner1@email.com', 'fat', '40');
INSERT INTO can_take_care VALUES ('caretaker3@email.com', 'petowner@email.com', 'alice', '50');


INSERT INTO can_take_care VALUES ('caretaker3@email.com', 'petowner3@email.com', 'pop', '50');
INSERT INTO can_take_care VALUES ('caretaker3@email.com', 'petowner2@email.com', 'faty2', '50');
INSERT INTO can_take_care VALUES ('caretaker3@email.com', 'petowner2@email.com', 'faty', '50');
INSERT INTO can_take_care VALUES ('caretaker3@email.com', 'petowner2@email.com', 'faty3', '50');

INSERT INTO can_take_care VALUES ('caretaker4@email.com', 'petowner@email.com', 'alice', '50');
INSERT INTO can_take_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty', '50');
INSERT INTO can_take_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty2', '50');
INSERT INTO can_take_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty3', '50');

INSERT INTO can_take_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'alice', '50');
INSERT INTO can_take_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'bob', '50');
INSERT INTO can_take_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty', '50');
INSERT INTO can_take_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty2', '50');
INSERT INTO can_take_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty3', '50');

INSERT INTO is_unavailable_on VALUES ('caretaker@email.com', '10/20/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker@email.com', '11/10/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker@email.com', '11/27/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker@email.com', '11/29/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker1@email.com', '10/31/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker1@email.com', '11/01/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker1@email.com', '12/01/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker1@email.com', '11/23/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker2@email.com', '10/22/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker2@email.com', '10/25/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker2@email.com', '12/01/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker2@email.com', '12/04/2020');
INSERT INTO is_unavailable_on VALUES ('caretaker1@email.com', '11/26/2020'); 

INSERT INTO is_free_on VALUES ('caretaker3@email.com', '10/20/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '10/21/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '11/04/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '11/23/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '11/24/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '11/25/2020');

INSERT INTO is_free_on VALUES ('caretaker3@email.com', '10/13/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '10/14/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '10/15/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '10/16/2020');
INSERT INTO is_free_on VALUES ('caretaker3@email.com', '10/17/2020');

INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/13/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/14/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/15/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/16/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/17/2020');

INSERT INTO is_free_on VALUES ('caretaker5@email.com', '10/13/2020');
INSERT INTO is_free_on VALUES ('caretaker5@email.com', '10/14/2020');
INSERT INTO is_free_on VALUES ('caretaker5@email.com', '10/15/2020');
INSERT INTO is_free_on VALUES ('caretaker5@email.com', '10/16/2020');
INSERT INTO is_free_on VALUES ('caretaker5@email.com', '10/17/2020');

INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/25/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/22/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '10/23/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '12/01/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '12/03/2020');
INSERT INTO is_free_on VALUES ('caretaker4@email.com', '12/04/2020');

INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner@email.com', 'alice', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner@email.com', 'bob', 25, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty2', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty3', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner@email.com', 'alice', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner@email.com', 'bob', 25, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker@email.com', 'petowner2@email.com', 'faty2', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'alice', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'bob', 25, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty2', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'alice', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'bob', 25, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty2', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'alice', 45, '10-17-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner@email.com', 'bob', 25, '10-17-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty', 45, '10-17-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty2', 45, '10-17-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker2@email.com', 'petowner2@email.com', 'faty3', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker3@email.com', 'petowner@email.com', 'alice', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker3@email.com', 'petowner@email.com', 'alice', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker3@email.com', 'petowner@email.com', 'alice', 45, '10-16-2020', '10', '2020');

INSERT INTO bids VALUES ('petowner@email.com', 'caretaker3@email.com', 'alice', 'SUCCESS', '2020-10-14', '2020-10-16', 60, 3, 1, 'visa', 'car');

INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner@email.com', 'alice', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner@email.com', 'alice', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner@email.com', 'alice', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner@email.com', 'alice', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner@email.com', 'alice', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty2', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty2', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty2', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty2', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty2', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty3', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty3', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty3', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty3', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker4@email.com', 'petowner2@email.com', 'faty3', 45, '10-17-2020', '10', '2020');

INSERT INTO bids VALUES ('petowner@email.com', 'caretaker4@email.com', 'alice', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 5, 1, 'visa', 'car');
INSERT INTO bids VALUES ('petowner2@email.com', 'caretaker4@email.com', 'faty', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 5, 1, 'visa', 'car');
INSERT INTO bids VALUES ('petowner2@email.com', 'caretaker4@email.com', 'faty2', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 5, 1, 'visa', 'car');
INSERT INTO bids VALUES ('petowner2@email.com', 'caretaker4@email.com', 'faty3', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 5, 1, 'visa', 'car');

INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'alice', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'alice', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'alice', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'alice', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'alice', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'bob', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'bob', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'bob', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'bob', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner@email.com', 'bob', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty2', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty2', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty2', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty2', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty2', 45, '10-17-2020', '10', '2020');

INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty3', 45, '10-13-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty3', 45, '10-14-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty3', 45, '10-15-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty3', 45, '10-16-2020', '10', '2020');
INSERT INTO is_taking_care VALUES ('caretaker5@email.com', 'petowner2@email.com', 'faty3', 45, '10-17-2020', '10', '2020');

INSERT INTO bids VALUES ('petowner@email.com', 'caretaker5@email.com', 'alice', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 5, 1, 'visa', 'car');
INSERT INTO bids VALUES ('petowner@email.com', 'caretaker5@email.com', 'bob', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 4.5, 1, 'visa', 'car');
INSERT INTO bids VALUES ('petowner2@email.com', 'caretaker5@email.com', 'faty', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 4.5, 1, 'visa', 'car');
INSERT INTO bids VALUES ('petowner2@email.com', 'caretaker5@email.com', 'faty2', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 5, 1, 'visa', 'car');
INSERT INTO bids VALUES ('petowner2@email.com', 'caretaker5@email.com', 'faty3', 'SUCCESS', '2020-10-13', '2020-10-17', 60, 5, 1, 'visa', 'car');




