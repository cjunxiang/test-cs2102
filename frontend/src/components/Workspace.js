import React from "react";
import styled from "styled-components";
import { CURRENT_PAGE } from "../common";

//LEGACY
import { ViewBids } from "./Pages/ViewBids";
import { ViewPetOwners } from "./Pages/ViewPetOwners";
import { ViewCareTakers } from "./Pages/ViewCareTakers";
import { CreatePet } from "./Pages/CreatePet";
import { ViewPets } from "./Pages/ViewPets";
import { CreateBid } from "./Pages/CreateBid";
import { ViewMyPets } from "./Pages/ViewMyPets";

// NEW
import { PetOwnerProfile } from "./NewPages/PetOwner/PetOwnerProfile";
import { PetOwnerBid } from "./NewPages/PetOwner/PetOwnerBid";
import { PetOwnerHistory } from "./NewPages/PetOwner/PetOwnerHistory";

import { PCSProfile } from "./NewPages/PCSAdmin/PCSProfile";
import { CreateUser } from "./Pages/CreateUser";
import { PCSHistory } from "./NewPages/PCSAdmin/PCSHistory";

import { CaretakerProfile } from "./NewPages/Caretaker/CaretakerProfile";
import { CaretakerLeave } from "./NewPages/Caretaker/CaretakerLeave";
import { CaretakerHistory } from "./NewPages/Caretaker/CaretakerHistory";

const VerticalWrapper = styled.div`
  left: 280px;
  position: absolute;
  background-color: #f2f7f7;
  padding: 20px;
  min-height: 80%;
  display: flex;
`;

export class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      currentPage,
      userType,
      petOwnerEmail,
      PCSEmail,
      caretakerEmail,
    } = this.props;
    return (
      <VerticalWrapper>
        {/* LEGACY ROUTES */}
        {currentPage === CURRENT_PAGE.VIEW_BIDS && <ViewBids />}
        {currentPage === CURRENT_PAGE.VIEW_PETOWNER && <ViewPetOwners />}
        {currentPage === CURRENT_PAGE.VIEW_CARETAKER && <ViewCareTakers />}
        {currentPage === CURRENT_PAGE.CREATE_PET && <CreatePet />}
        {currentPage === CURRENT_PAGE.VIEW_PETS && <ViewPets />}
        {currentPage === CURRENT_PAGE.VIEW_PETOWNER_PET && <ViewMyPets />}
        {currentPage === CURRENT_PAGE.CREATE_BID && <CreateBid />}
        {/* LEGACY ROUTES */}
        {currentPage === CURRENT_PAGE.PETOWNER_PROFILE && (
          <PetOwnerProfile userType={userType} petOwnerEmail={petOwnerEmail} />
        )}
        {currentPage === CURRENT_PAGE.PETOWNER_BID && (
          <PetOwnerBid petOwnerEmail={petOwnerEmail} />
        )}
        {currentPage === CURRENT_PAGE.PETOWNER_HISTORY && (
          <PetOwnerHistory petOwnerEmail={petOwnerEmail} />
        )}
        {currentPage === CURRENT_PAGE.CARETAKER_PROFILE && (
          <CaretakerProfile caretakerEmail={caretakerEmail} />
        )}
        {currentPage === CURRENT_PAGE.CARETAKER_LEAVE && (
          <CaretakerLeave caretakerEmail={caretakerEmail} />
        )}
        {currentPage === CURRENT_PAGE.CARETAKER_HISTORY && (
          <CaretakerHistory caretakerEmail={caretakerEmail} />
        )}
        {currentPage === CURRENT_PAGE.PCSADMIN_PROFILE && (
          <PCSProfile userType={userType} PCSEmail={PCSEmail} />
        )}
        {currentPage === CURRENT_PAGE.CREATE_USER && <CreateUser />}
        {currentPage === CURRENT_PAGE.PCSADMIN_HISTORY && (
          <PCSHistory PCSEmail={PCSEmail} />
        )}
      </VerticalWrapper>
    );
  }
}
