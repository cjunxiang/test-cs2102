import React from "react";
import { Button } from "@material-ui/core";
import Loading from "../Layout/Loading";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
export class CreatePet extends React.Component {
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

  handlePetType = (event) => {
    this.setState({ petType: event.target.value });
  };

  handleCreatePet = async () => {
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
    const { isLoading, petType, isSuccess, name } = this.state;
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
              Add more Pet
            </Button>
          </>
        )}
        {!isLoading && !isSuccess && (
          <>
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Pet Type</FormLabel>
              <RadioGroup value={petType} onChange={this.handlePetType}>
                <FormControlLabel value="dog" control={<Radio />} label="dog" />
                <FormControlLabel value="cat" control={<Radio />} label="cat" />
                <FormControlLabel
                  value="hamster"
                  control={<Radio />}
                  label="hamster"
                />
                <FormControlLabel
                  value="tortise"
                  control={<Radio />}
                  label="tortise"
                />
                <FormControlLabel
                  value="bird"
                  control={<Radio />}
                  label="bird"
                />
              </RadioGroup>
            </FormControl>
            <form>
              <p>Pet Name:</p>
              <TextField
                type="text"
                name="name"
                label="Pet name"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
              <p>Special Requirements:</p>
              <TextField
                type="text"
                name="special"
                multiline
                rows={4}
                label="Special Requirements"
                variant="outlined"
                onChange={this.myChangeHandler}
              />
              <p>Dog Description:</p>
              <TextField
                type="text"
                name="profile"
                multiline
                rows={4}
                label="Pet Profile"
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
                this.handleCreatePet();
              }}
            >
              Add Pet
            </Button>
            <br />
          </>
        )}
      </>
    );
  }
}
