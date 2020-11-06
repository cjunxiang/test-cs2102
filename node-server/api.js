const express = require('express');

const router = express.Router();
const systemUser = require('./database/system_user.js');
const payChecks = require('./database/paychecks.js');
const creditCard = require('./database/credit_card.js');
const paymentCredentials = require('./database/payment_credentials.js');
const petOwner = require('./database/pet_owner.js');
const careTaker = require('./database/care_taker.js');
const fullTimeCareTaker = require('./database/full_time_caretaker.js');
const partTimeCareTaker = require('./database/part_time_caretaker.js');
const pcsAdmin = require('./database/pcs_admin.js');
const bids = require('./database/bids.js');
const pets = require('./database/pets.js');
const canTakeCare = require('./database/can_take_care.js');
const partTimeSchedule = require('./database/is_free_on.js');
const fullTimeSchedule = require('./database/is_unavailable_on.js');

router.get(
  '/test-server, (request, response) => {response.status(200).json("Yes Server is Up");}}'
);

// system_user CRUD
router.get('/users', systemUser.getUsers);
router.post('/users', systemUser.createUser);
router.put('/users/:email', systemUser.updateUser);
router.delete('/users/:email', systemUser.deleteUser);

// system_user queries
router.get('/users/:email', systemUser.getUserByEmail);

// paychecks CRD queries
router.get('/paychecks', payChecks.getPaychecks);
router.post('/paychecks', payChecks.createPaycheck);
router.delete('/paychecks/:payment_addressee/:date_of_issue', payChecks.deletePaycheck);

//get all paychecks by a given PCS administrator
router.get('/paycheckspcs/:payment_admin', payChecks.getPaychecksByPcsAdmin);

// paychecks queries
router.get('/paychecks/:payment_addressee', payChecks.getPaychecksByName);
router.get('/paychecks/:month_of_issue/:year_of_issue', payChecks.getPaychecksByMonthAndYear);

// credit_card CRUD
router.get('/creditcard', creditCard.getCreditCard);
router.post('/creditcard', creditCard.createCreditCard);
router.put('/creditcard/:credit_card_number/:credit_card_expiry', creditCard.updateCreditCard);
router.delete('/creditcard/:credit_card_number/:credit_card_expiry', creditCard.deleteCreditCard);

// credit_card queries
router.get('/creditcard/:credit_card_name', creditCard.getCreditCardByName);

// payment_credentials CRUD
router.get('/paymentcredentials', paymentCredentials.getPaymentCredentials);
router.post('/paymentcredentials', paymentCredentials.createPaymentCredentials);
// must update credit_card before we can update payment credentials
// router.put('/paymentcredentials/:email/:credit_card_number', paymentCredentials.updatePaymentCredentials);
router.delete(
  '/paymentcredentials/:email/:credit_card_number/:credit_card_expiry',
  paymentCredentials.deletePaymentCredentials
);

// payment_credentials queries
router.get('/paymentcredentials/:email', paymentCredentials.getPaymentCredentialsByEmail);

// pet_owner CRUD
router.get('/petowners', petOwner.getPetOwners);
router.post('/petowners', petOwner.createPetOwner);
router.delete('/petowners/:email', petOwner.deletePetOwner);

// care_taker CRUD
router.get('/caretaker', careTaker.getCareTaker);
router.post('/caretaker', careTaker.createCareTaker);
router.delete('/caretaker/:email', careTaker.deleteCareTaker);

//get caretaker type by email
router.get('/caretaker/:email', careTaker.getCareTakerTypeByEmail);

// full time care_taker CRUD
router.get('/fulltimecaretaker', fullTimeCareTaker.getFullTimeCareTaker);
router.post('/fulltimecaretaker', fullTimeCareTaker.createFullTimeCareTaker);
router.delete('/fulltimecaretaker/:email', fullTimeCareTaker.deleteFullTimeCareTaker);

// part time care_taker CRUD
router.get('/parttimecaretaker', partTimeCareTaker.getPartTimeCareTaker);
router.post('/parttimecaretaker', partTimeCareTaker.createPartTimeCareTaker);
router.delete('/parttimecaretaker/:email', partTimeCareTaker.deletePartTimeCareTaker);

// pcs_admin CRUD
router.get('/pcsadmin', pcsAdmin.getPcsAdmin);
router.post('/pcsadmin', pcsAdmin.createPcsAdmin);
router.delete('/pcsadmin/:email', pcsAdmin.deletePcsAdmin);

// bids CRUD
router.get('/bids', bids.getBids);
router.post('/bids', bids.createBid);
router.put('/bids/:care_taker_email/:pet_owner_email/:pet_name/:start_date/:end_date/:price', bids.updateBid);
router.delete('/bids/:care_taker_email/:pet_owner_email', bids.deleteBid);

//get pets being taken care of by a given caretaker on a date
router.get('/bids/:care_taker_email/:date', bids.getPetsBeingTakenCareOf);

// bid queries
router.get('/bids/:care_taker_email/:pet_owner_email', bids.getBidByBoth);
router.get('/pet_owner_success_bids/:pet_owner_email', bids.getBidByPetOwnerEmailSuccess);
router.get('/care_taker_success_bids/:care_taker_email', bids.getBidByCareTakerEmailSuccess);
router.get('/care_taker_reviews/:care_taker_email', bids.getReviewsByCareTaker);
router.get('/pet_owner_reviews/:pet_owner_email', bids.getReviewsByPetOwner);

// pets CRUD
router.get('/pets', pets.getPets);
router.post('/pets', pets.createPet);
router.put('/pets/:pet_name/:pet_owner_email', pets.updatePet);
router.delete('/pets/:pet_name/:pet_owner_email', pets.deletePet);

// pets queries
router.get('/pets/:pet_owner_email', pets.getPetsByOwner);

// can_take_care CRUD
router.get('/cantakecare', canTakeCare.getCanTakeCare);
router.post('/cantakecare', canTakeCare.createCanTakeCare);
router.put(
  '/cantakecare/:pet_owner_email/:care_taker_email/:pet_name',
  canTakeCare.updateCanTakeCare
);
router.delete(
  '/cantakecare/:pet_owner_email/:care_taker_email/:pet_name',
  canTakeCare.deleteCanTakeCare
);

// can_take_care queries
router.get('/cantakecare/:care_taker_email', canTakeCare.getCanTakeCareByCaretaker);

// is_unavailable_on CRD
router.get('/fulltimeschedule', fullTimeSchedule.getBusyDays);
router.get('/fulltimeschedule/:email', fullTimeSchedule.getBusyDaysByCaretaker);
router.post('/fulltimeschedule', fullTimeSchedule.createBusyDay);
router.delete('/fulltimeschedule/:email/:unavailable_date', fullTimeSchedule.deleteBusyDay);

// get full-time caretaker within a specified date range
router.get('/fulltimeschedule/:start_date/:end_date', fullTimeSchedule.getAvailableFullTimeCareTaker);

// is_free_on CRD
router.get('/parttimeschedule', partTimeSchedule.getFreeDays);
router.get('/parttimeschedule/:email', partTimeSchedule.getFreeDaysByCaretaker);
router.post('/parttimeschedule', partTimeSchedule.createFreeDay);
router.delete('/parttimeschedule/:email/:free_date', partTimeSchedule.deleteFreeDay);

// get part-time caretaker within a specified date range
router.get('/parttimeschedule/:start_date/:end_date', partTimeSchedule.getAvailablePartTimeCareTaker);

// complex queries
router.get('/petdays/:care_taker_email', bids.getMonthlyPetDaysByCaretaker);
router.get('/fulltimesalary/:care_taker_email', bids.getExpectedMonthlySalaryFullTime);
router.get('/parttimesalary/:care_taker_email', bids.getExpectedMonthlySalaryPartTime);
router.get('/recentSuccessfulBids/:pet_owner_email', bids.getRecentTenSuccesfulBidsByPetOwner);
router.get('/getavailablecaretakers/:start_date/:end_date/:pet_name', petOwner.getAvailableCareTakersByDateRange);

module.exports = router;
