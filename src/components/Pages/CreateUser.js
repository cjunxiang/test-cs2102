import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Loading from "../Layout/Loading";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { USER_TYPES } from "../../common";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSuccess: false,
    };
  }

  componentDidMount = async () => {
    // await this.testApi();
    this.setState({
      isLoading: false,
      newUserType: USER_TYPES.CARETAKER,
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

  handleUserType = (event) => {
    this.setState({ newUserType: event.target.value });
  };

  handleCreateUser = async () => {
    const { newUserType, name, email, password } = this.state;
    console.log(newUserType, name, email, password);
    await fetch("/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(`Caught promise: ${error}`));

    let secondQueryString = "/";
    switch (newUserType) {
      case USER_TYPES.ADMIN:
        secondQueryString += "pcsadmin";
        break;
      case USER_TYPES.CARETAKER:
        secondQueryString += "caretaker";
        break;
      case USER_TYPES.PETOWNER:
        secondQueryString += "petowners";
        break;
      default:
        break;
    }

    await fetch(secondQueryString, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        this.setState({
          isLoading: false,
          isSuccess: true,
          response: data,
        });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  render() {
    const { isLoading, newUserType, isSuccess, name, response } = this.state;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && isSuccess && (
          <VerticalWrapper>
            <h1>Admin Create User Page</h1>
            Successfully added {name}.
            <br />
            {response}
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
              Add more User
            </Button>
          </VerticalWrapper>
        )}
        {!isLoading && !isSuccess && (
          <VerticalWrapper>
            <h1>Admin Create User Page</h1>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={newUserType}
                onChange={this.handleUserType}
              >
                <FormControlLabel
                  value={USER_TYPES.ADMIN}
                  control={<Radio />}
                  label="Admin"
                />
                <FormControlLabel
                  value={USER_TYPES.CARETAKER}
                  control={<Radio />}
                  label="Care Taker"
                />
                <FormControlLabel
                  value={USER_TYPES.PETOWNER}
                  control={<Radio />}
                  label="Pet Owner"
                />
              </RadioGroup>
            </FormControl>
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
