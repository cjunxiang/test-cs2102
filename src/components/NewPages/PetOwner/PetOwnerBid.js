import React from "react";
import styled from "styled-components";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; //
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import MaterialTable from "material-table";
import MenuItem from "@material-ui/core/MenuItem";
import { addDays } from "date-fns";
import { Button } from "@material-ui/core";
import Loading from "../../Layout/Loading";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { convertDateTimeToYYYYMMdd } from "../../../common";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

const VerticalWrapper1 = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

const StyledDiv = styled.div`
  border: 1px solid black;
  display: inline-block;
`;
export class PetOwnerBid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSuccess: false,
      selectedPet: "",
      caretakers: [],
      caretakeremail: "",
      caretakerColumn: [{ title: "Email", field: "email" }],
      pets: [],
      dateRangePicker: {
        selection: {
          endDate: addDays(new Date(), 7),
          startDate: addDays(new Date(), 1),
          key: "selection",
        },
      },
    };
  }

  componentDidMount = async () => {
    await this.fetchMyPets();
    await this.fetchAvailableCaretakers();
  };

  fetchMyPets = async () => {
    await fetch("/pets/" + this.props.petOwnerEmail, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ pets: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  fetchAvailableCaretakers = async () => {
    if (this.state.petName) {
      await fetch(
        "/getavailablecaretakers/" +
          convertDateTimeToYYYYMMdd(
            this.state.dateRangePicker.selection.startDate
          ) +
          "/" +
          convertDateTimeToYYYYMMdd(
            this.state.dateRangePicker.selection.endDate
          ) +
          "/" +
          this.state.pet.pet_name,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.setState({ caretakers: data, isLoading: false });
        })
        .catch((error) => console.log(`Caught promise: ${error}`));
    }
  };

  handleConfirmSelectDates = (which, payload) => {
    this.setState({
      isFetchingData: true,
      [which]: {
        ...this.state[which],
        ...payload,
      },
      isLoading: true,
    });
    this.fetchAvailableCaretakers();
  };

  handleSelectPet = (e) => {
    this.setState({
      selectedPet: e.target.value,
    });
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  handlePaymentMethod = (e) => {
    this.setState({
      paymentMethod: e.target.value,
    });
  };

  handleDeliveryMode = (e) => {
    this.setState({
      deliveryMode: e.target.value,
    });
  };
  handleSelectCareTaker = (e) => {
    this.setState({
      caretakeremail: e.target.value,
    });
  };

  handleCreateBid = async () => {
    await fetch("/bids/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pet_owner_email: this.props.petOwnerEmail,
        care_taker_email: this.state.caretakeremail,
        pet_name: this.state.selectedPet.pet_name,
        success_status: "fail",
        start_date: convertDateTimeToYYYYMMdd(
          this.state.dateRangePicker.selection.startDate
        ),
        end_date: convertDateTimeToYYYYMMdd(
          this.state.dateRangePicker.selection.endDate
        ),
        price: this.state.price,
        rating: 1,
        review: "1",
        payment_method: this.state.paymentMethod,
        delivery_method: this.state.deliveryMode,
      }),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        this.setState({ isLoading: false, isSuccess: true });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    const {
      isLoading,
      selectedPet,
      pets,
      paymentMethod,
      deliveryMode,
      caretakeremail,
      isSuccess,
      price,
      caretakers,
    } = this.state;

    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <VerticalWrapper1>
              {!isSuccess && (
                <>
                  <h1>Pet Owner Bid Page</h1>
                  <h2>Pet</h2>
                  <h2>Selected Pet</h2>
                  {pets.length && (
                    <FormControl variant="filled">
                      <Select
                        value={selectedPet}
                        onChange={this.handleSelectPet}
                      >
                        {pets.map((pet) => (
                          <MenuItem value={pet}>{pet.pet_name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <br />
                  <h2>Date Range</h2>
                  {convertDateTimeToYYYYMMdd(
                    this.state.dateRangePicker.selection.startDate
                  ) +
                    " TO " +
                    convertDateTimeToYYYYMMdd(
                      this.state.dateRangePicker.selection.endDate
                    )}
                  <br />
                  <br />
                  <DateRangePicker
                    onChange={this.handleConfirmSelectDates.bind(
                      this,
                      "dateRangePicker"
                    )}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={[this.state.dateRangePicker.selection]}
                    minDate={addDays(new Date(), 1)}
                  />
                  <hr />
                  <br />
                  <h2>Input Caretaker Email</h2>
                  Tip: These care takers are confirmed to be available given
                  your selected date range column
                  <br />
                  <br />
                  <FormControl variant="filled">
                    <Select
                      value={caretakeremail}
                      onChange={this.handleSelectCareTaker}
                    >
                      {caretakers.map((caretaker) => (
                        <MenuItem value={caretaker.email}>
                          {caretaker.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <h2>Your Bidding Price</h2>
                  <TextField
                    type="number"
                    name="price"
                    label="Your Bid"
                    variant="outlined"
                    onChange={this.myChangeHandler}
                  />
                  <h2>Input Payment Method</h2>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={paymentMethod}
                      onChange={this.handlePaymentMethod}
                    >
                      <FormControlLabel
                        value="visa"
                        control={<Radio />}
                        label="visa"
                      />
                      <FormControlLabel
                        value="master"
                        control={<Radio />}
                        label="master"
                      />
                    </RadioGroup>
                  </FormControl>
                  <h2>Select Delivery Mode</h2>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={deliveryMode}
                      onChange={this.handleDeliveryMode}
                    >
                      <FormControlLabel
                        value="car"
                        control={<Radio />}
                        label="car"
                      />
                      <FormControlLabel
                        value="pick-up"
                        control={<Radio />}
                        label="pick-up"
                      />
                    </RadioGroup>
                  </FormControl>
                  <br />
                  <h4>
                    **Note that bids MAY or MAY NOT be Successful. It depends on
                    availability and other factors.
                  </h4>
                  <h4>Fill in all fields to create bid</h4>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      !deliveryMode ||
                      !paymentMethod ||
                      !caretakeremail ||
                      !selectedPet ||
                      !price
                    }
                    onClick={this.handleCreateBid}
                  >
                    Create Bid
                  </Button>{" "}
                </>
              )}
              {isSuccess && (
                <Button onClick={this.setState({ isSuccess: false })}>
                  Create More Bid
                </Button>
              )}
            </VerticalWrapper1>
            <StyledDiv />
            <VerticalWrapper>
              <h2>Available Caretakers</h2>
              <MaterialTable
                columns={this.state.caretakerColumn}
                data={this.state.caretakers}
                title="Available Caretakers"
              />
            </VerticalWrapper>
          </>
        )}
      </>
    );
  }
}
