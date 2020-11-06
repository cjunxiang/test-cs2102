export const USER_TYPES = {
  ADMIN: "PCS Administrator",
  CARETAKER: "Care Taker",
  PETOWNER: "Pet Owner",
};

export const CURRENT_PAGE = {
  // LEGACY ROUTES
  VIEW_CARETAKER: "View Caretakers",
  VIEW_PETOWNER: "View Pet Owners",
  VIEW_BIDS: "View All Bids",
  VIEW_PETS: "View Pets",
  VIEW_PETOWNER_PET: "View my Pets",
  CREATE_PET: "Add New Pet",
  CREATE_BID: "Create Bid",
  CREATE_USER: "Create User",
  // BELOW IS NEW
  PETOWNER_PROFILE: "Pet Owner Profile",
  PETOWNER_BID: "Pet Owner Bid",
  PETOWNER_HISTORY: "Pet Owner History",
  CARETAKER_PROFILE: "Care Taker Profile",
  CARETAKER_LEAVE: "Manage Leave",
  CARETAKER_HISTORY: "Care Taker History",
  PCSADMIN_PROFILE: "Admin Profile",
  PCSADMIN_HISTORY: "Admin Paychecks",
};

//converts object to YYYYMMDD
export const convertDateTimeToYYYYMMdd = (oldDate) => {
  const date = new Date(oldDate);
  let newDateString =
    date.getFullYear() +
    "-" +
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "-" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());

  return newDateString;
};

export const convertDateTimeToddMMYYYY = (oldDate) => {
  const date = new Date(oldDate);
  let newDateString =
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
    "/" +
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "/" +
    date.getFullYear();

  return newDateString;
};

export const getTodayDateString = () => {
  const date = new Date();
  let newDateString =
    date.getFullYear() +
    "-" +
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "-" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());

  return newDateString;
};
