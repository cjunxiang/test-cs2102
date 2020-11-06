import React from "react";
import styled from "styled-components";
import { LeftBar } from "./Layout/LeftBar";
import { Workspace } from "./Workspace";
import { USER_TYPES, CURRENT_PAGE } from "../common";

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f2f7f7;
  font-family: HelveticaNeue;
`;
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: USER_TYPES.PETOWNER,
      currentPage: CURRENT_PAGE.PCSADMIN_PROFILE,
      petOwnerEmail: "petowner2@email.com",
      PCSEmail: "pcsadmin@email.com",
      caretakerEmail: "caretaker2@email.com",
    };
  }

  handleUserType = (newType) => {
    this.setState({
      userType: newType.target.value,
    });
  };

  handlePageChange = (selectedPage) => {
    console.log(selectedPage);
    this.setState({
      currentPage: selectedPage,
    });
  };

  render() {
    const {
      userType,
      currentPage,
      petOwnerEmail,
      PCSEmail,
      caretakerEmail,
    } = this.state;
    return (
      <MainContainer>
        <LeftBar
          userType={userType}
          handleUserType={this.handleUserType}
          handlePageChange={this.handlePageChange}
          currentPage={currentPage}
          petOwnerEmail={petOwnerEmail}
          caretakerEmail={caretakerEmail}
          PCSEmail={PCSEmail}
        />
        <Workspace
          currentPage={currentPage}
          userType={userType}
          handleUserType={this.handleUserType}
          petOwnerEmail={petOwnerEmail}
          caretakerEmail={caretakerEmail}
          PCSEmail={PCSEmail}
        />
      </MainContainer>
    );
  }
}
