import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";
import Card from "@material-ui/core/Card";
import { Button } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Loading from "../../Layout/Loading";
import { CreatePet } from "../../Pages/CreatePet";
import { CreateCard } from "../../Pages/CreateCard";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class PetOwnerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAddPet: false,
      isAddCard: false,
      petColumns: [
        { title: "Name", field: "pet_name" },
        { title: "Type", field: "category" },
        { title: "Descriptions", field: "profile" },
        { title: "Special Requirements", field: "special_requirements" },
      ],
      paymentColumns: [
        { title: "Credit Card Num", field: "credit_card_number" },
        { title: "Expiry Date", field: "credit_card_expiry" },
      ],
      recentColumns: [
        { title: "Caretaker Email", field: "care_taker_email" },
        { title: "Pet Name", field: "pet_name" },
        { title: "Success_status", field: "success_status" },
        { title: "Start Date", field: "start_date" },
        { title: "End Date", field: "end_date" },
        { title: "Price", field: "price" },
        { title: "Rating", field: "rating" },
        { title: "Review", field: "review" },
        { title: "Payment Method", field: "payment_method" },
        { title: "Delivery Method", field: "delivery_method" },
      ],
      pets: [],
      paymentMethods: [],
    };
  }

  componentDidMount = async () => {
    await this.fetchUserName();
    await this.fetchMyPets();
    await this.fetchRecents();
  };

  handleAddPet = () => {
    this.setState({
      isAddPet: !this.state.isAddPet,
    });
  };

  handleAddCard = () => {
    this.setState({
      isAddCard: !this.state.isAddCard,
    });
  };

  fetchMyPets = async () => {
    await fetch("/api/pets/" + this.props.petOwnerEmail, {
      headers: {
        accepts: "application/json",
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

  fetchUserName = async () => {
    await fetch("/api/users/" + this.props.petOwnerEmail, {
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
        this.setState({ name: data[0].name, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  fetchRecents = async () => {
    await fetch("/api/recentSuccessfulBids/" + this.props.petOwnerEmail, {
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
        this.setState({ recents: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  fetchPaymentMethods = async () => {
    await fetch("/api/paymentcredentials/" + this.props.petOwnerEmail, {
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
        this.setState({ paymentMethods: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  handleDeletePayment = async (oldData) => {
    await fetch(
      "/api/paymentcredentials/" +
        this.props.petOwnerEmail +
        "/" +
        oldData.credit_card_number +
        "/" +
        oldData.credit_card_expiry,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  handleDeletePet = async (oldData) => {
    await fetch(
      "/api/pets/" + oldData.pet_name + "/" + oldData.pet_owner_email,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  render() {
    const {
      isLoading,
      name,
      isAddPet,
      isAddCard,
      // eslint-disable-next-line no-unused-vars
      pets,
      // eslint-disable-next-line no-unused-vars
      paymentMethods,
    } = this.state;
    const { userType, petOwnerEmail } = this.props;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <h1>Pet Owner Profile Page</h1>
            <h2>My Profile</h2>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {name}
                </Typography>
                <Typography color="textSecondary">{userType}</Typography>
                <Typography variant="body2" component="p">
                  {petOwnerEmail}
                </Typography>
              </CardContent>
            </Card>
            <br />
            <h2>My Pets</h2>
            {!isAddPet && (
              <Button onClick={this.handleAddPet} variant="contained">
                Add New Pet
              </Button>
            )}
            {isAddPet && (
              <>
                <CreatePet />
                <Button onClick={this.handleAddPet}>Cancel</Button> <hr />
              </>
            )}
            <MaterialTable
              columns={this.state.petColumns}
              data={this.state.pets}
              title="My Pets"
              options={{
                actionsColumnIndex: -1,
              }}
              editable={{
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const pets = [...prevState.pets];
                        pets.splice(pets.indexOf(oldData), 1);
                        return { ...prevState, pets };
                      });
                      this.handleDeletePet(oldData);
                    }, 600);
                  }),
              }}
            />
            <h2>My Payment Methods</h2>
            {!isAddCard && (
              <Button onClick={this.handleAddCard} variant="contained">
                Add New Card
              </Button>
            )}
            {isAddCard && (
              <>
                <CreateCard />
                <Button onClick={this.handleAddCard}>Cancel</Button> <hr />
              </>
            )}
            <MaterialTable
              columns={this.state.paymentColumns}
              data={this.state.paymentMethods}
              title="My Payment Methods"
              options={{
                actionsColumnIndex: -1,
              }}
              editable={{
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const paymentMethods = [...prevState.paymentMethods];
                        paymentMethods.splice(
                          paymentMethods.indexOf(oldData),
                          1
                        );
                        return { ...prevState, paymentMethods };
                      });
                      this.handleDeletePayment(oldData);
                    }, 600);
                  }),
              }}
            />
            <h2>My Recents</h2>
            <MaterialTable
              columns={this.state.recentColumns}
              data={this.state.recents}
              title="My Recents"
              options={{
                actionsColumnIndex: -1,
              }}
            />
          </VerticalWrapper>
        )}
      </>
    );
  }
}
