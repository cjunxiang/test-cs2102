import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Loading from "../Layout/Loading";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import TextField from "@material-ui/core/TextField";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { USER_TYPES } from "../../common";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class CreateBid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSuccess: false,
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
    // await this.testApi();
    this.setState({
      isLoading: false,
      newUserType: USER_TYPES.CARETAKER,
      focusedRange: [0, 0],
    });
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;

    // if (nam === "password") {
    //   if (val.length < 6) {
    //     alert("Your password must be at least 6 characters");
    //   }
    // }
    this.setState({ [nam]: val });
  };

  handleCreateBid = () => {
    /**
 * {
    "pet_owner_email": "petowner3@email.com",
    "care_taker_email": "caretaker3@email.com",
    "pet_name": "pop",
    "success_status": "fail",
    "start_date": "02/12/2020",
    "end_date": "03/12/2020",
    "month": "January",
    "year": "2020",
    "price": "60",
    "rating": "1",
    "review": "1",
    "delivery_method": "car",
    "payment_method": "visa"
}
 */
    // const { newUserType, name, email, password } = this.state;
    // console.log(newUserType, name, email, password);
    // ({
    //   pet_owner_email: "petowner@email.com",
    //   care_taker_email: "test",
    //   pet_name: "test",
    //   success_status: "fail",
    //   start_date: "test",
    //   end_date: "test",
    //   price: "test",
    //   rating: "test",
    //   review: "test",
    //   delivery_method: "test",
    //   payment_method: "visa",
    // });
    this.setState({
      isLoading: false,
      isSuccess: true,
    });
  };

  handleSelectDateRange = () => {
    this.setState({
      isSelectDate: !this.state.isSelectDate,
    });
  };

  handleConfirmSelectDates = (which, payload) => {
    this.setState({
      isFetchingData: true,
      [which]: {
        ...this.state[which],
        ...payload,
      },
    });
  };

  render() {
    const {
      isLoading,
      focusedRange,
      isSuccess,
      name,
      dateRangePicker,
    } = this.state;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && isSuccess && (
          <VerticalWrapper>
            Successfully bidded for {name}
            <br />@ {dateRangePicker.selection.startDate.toString()} TO{" "}
            {dateRangePicker.selection.endDate.toString()}.
            <br />
            <hr />
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                this.setState({
                  isSuccess: false,
                });
              }}
            >
              Create New Bid
            </Button>
          </VerticalWrapper>
        )}
        {!isLoading && !isSuccess && (
          <VerticalWrapper>
            <form>
              <p>Name:</p>
              <TextField
                type="text"
                name="name"
                label="Your name"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
              <p>Email:</p>
              <TextField
                type="text"
                name="email"
                label="Email"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
              <p>Enter password:</p>
              <TextField
                type="text"
                name="password"
                label="Password"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
            </form>
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
              focusedRange={focusedRange}
              onRangeFocusChange={(focusedRange) => {
                const [, rangeStep] = focusedRange;
                if (!rangeStep) {
                  this.handleSelectDateRange();
                }
                this.setState({ focusedRange });
              }}
            />
            <hr />
            <br />
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                this.setState({
                  isLoading: true,
                });
                this.handleCreateUser();
              }}
            >
              Create User
            </Button>
          </VerticalWrapper>
        )}
      </>
    );
  }
}
