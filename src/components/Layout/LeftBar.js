import React from "react";
import styled from "styled-components";
import { Drawer } from "@material-ui/core";
import { Button as DefaultButton } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { CURRENT_PAGE, USER_TYPES } from "../../common";
import Divider from "@material-ui/core/Divider";

const LeftDrawer = styled(({ isMinimise, ...other }) => <Drawer {...other} />)`
  & .MuiDrawer-paperAnchorDockedLeft {
    width: 280px;
    background-color: #3f51b5;
    border: none;
    -webkit-box-shadow: 1px 3px 1px #9e9e9e;
    -moz-box-shadow: 1px 3px 1px #9e9e9e;
    box-shadow: 1px 3px 1px #9e9e9e;
  }
`;

const Button = styled(DefaultButton)`
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
`;

const IconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
`;

const TitleText = styled.h1`
  font-size: 20px;
  color: #000000;
  font-weight: 900;
`;

export class LeftBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handlePageChange = (newpage) => {
    this.props.handlePageChange(newpage);
  };

  render() {
    const {
      userType,
      handleUserType,
      petOwnerEmail,
      PCSEmail,
      caretakerEmail,
    } = this.props;
    return (
      <LeftDrawer variant="permanent" anchor="left" open>
        <IconsContainer>
          <TitleText>CS2102 PET SHOP</TitleText>
          <FormControl variant="filled">
            <InputLabel id="demo-simple-select-filled-label">
              <b>Account Type</b>
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={userType}
              onChange={handleUserType}
            >
              <MenuItem value={USER_TYPES.ADMIN}>PCS Administrator</MenuItem>
              <MenuItem value={USER_TYPES.CARETAKER}>Care Taker</MenuItem>
              <MenuItem value={USER_TYPES.PETOWNER}>Pet Owner</MenuItem>
            </Select>
          </FormControl>
          <hr />
          {userType === USER_TYPES.ADMIN && (
            <>
              <h5>
                Admin-only Features
                <br />
                Emulated Admin: {PCSEmail}
              </h5>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.PCSADMIN_PROFILE);
                }}
              >
                My Profile
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.CREATE_USER);
                }}
              >
                Create User
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.PCSADMIN_HISTORY);
                }}
              >
                Paychecks
              </Button>
              <Divider variant="middle" />
              <hr />
            </>
          )}
          {userType === USER_TYPES.ADMIN && (
            <>
              <h5>
                Caretaker-only Features
                <br />
                Emulated Caretaker: {caretakerEmail}
              </h5>
            </>
          )}
          {(userType === USER_TYPES.CARETAKER ||
            userType === USER_TYPES.ADMIN) && (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.CARETAKER_PROFILE);
                }}
              >
                My Profile
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.CARETAKER_LEAVE);
                }}
              >
                Manage Leave
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.CARETAKER_HISTORY);
                }}
              >
                History
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.VIEW_PETS);
                }}
              >
                View All Pets
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.VIEW_PETOWNER);
                }}
              >
                View All Pet Owners
              </Button>
              <Divider variant="middle" />

              <hr />
            </>
          )}
          {userType === USER_TYPES.ADMIN && (
            <>
              <h5>
                Pet-owner-only Features
                <br />
                Emulated PetOwner: {petOwnerEmail}
              </h5>
            </>
          )}
          {(userType === USER_TYPES.PETOWNER ||
            userType === USER_TYPES.ADMIN) && (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.PETOWNER_PROFILE);
                }}
              >
                My Profile
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.PETOWNER_BID);
                }}
              >
                Bid for Care-Takers
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.PETOWNER_HISTORY);
                }}
              >
                History
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handlePageChange(CURRENT_PAGE.VIEW_CARETAKER);
                }}
              >
                View All Caretakers
              </Button>
              <Divider variant="middle" />
              <hr />
            </>
          )}
        </IconsContainer>
      </LeftDrawer>
    );
  }
}
