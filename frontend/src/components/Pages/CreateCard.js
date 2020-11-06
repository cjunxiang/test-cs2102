import React from "react";
import { Button } from "@material-ui/core";
import Loading from "../Layout/Loading";
import TextField from "@material-ui/core/TextField";

export class CreateCard extends React.Component {
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
      petType: "dog",
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

  handleCreateCard = async () => {
    const { name, special, petType, profile } = this.state;
    console.log(name, special, petType, profile);
    fetch("/api/pets", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pet_owner_email: "petowner3@email.com",
        category: "dog",
        special_requirements: "dog",
        pet_name: "doggy2",
        profile: "profile",
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });

    this.setState({
      isLoading: false,
      isSuccess: true,
    });
  };

  render() {
    const { isLoading, isSuccess, name } = this.state;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && isSuccess && (
          <>
            Successfully added {name}.
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
              Add more
            </Button>
          </>
        )}
        {!isLoading && !isSuccess && (
          <>
            <br />
            <form>
              <p>Credit Card Number:</p>
              <TextField
                type="text"
                name="number"
                label="Credit Card Number"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
              <p>Expiry:</p>
              <TextField
                type="text"
                name="expiry"
                label="Expiry"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
              <p>CVV:</p>
              <TextField
                type="text"
                name="cvv"
                label="CVV"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
            </form>
            <br />
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                this.setState({
                  isLoading: true,
                });
                this.handleCreateCard();
              }}
            >
              Add Card
            </Button>
            <br />
          </>
        )}
      </>
    );
  }
}
