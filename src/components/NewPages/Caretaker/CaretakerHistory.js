import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";

import Loading from "../../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class CaretakerHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      pastPaychecks: [],
      paycheckColumns: [
        { title: "Payer", field: "payment_admin" },
        { title: "Addressee", field: "payment_addressee" },
        { title: "Amount", field: "amount" },
        { title: "Month", field: "month_of_issue" },
        { title: "Year", field: "year_of_issue" },
      ],
      pastBids: [],
      bidColumns: [
        { title: "Pet Owner Email", field: "pet_owner_email" },
        { title: "Pet Name", field: "pet_name" },
        { title: "Success", field: "success_status" },
        { title: "Started", field: "start_date" },
        { title: "Ended", field: "end_date" },
        { title: "Price", field: "price" },
        { title: "Ratings", field: "rating" },
        { title: "Review", field: "review" },
        { title: "Payment Method", field: "payment_method" },
        { title: "Delivery Method", field: "delivery_method" },
      ],
    };
  }

  componentDidMount = async () => {
    await this.fetchPastPaychecks();
    await this.fetchPastBids();
    this.setState({
      isLoading: false,
    });
  };

  fetchPastBids = async () => {
    await fetch("/care_taker_success_bids/" + this.props.caretakerEmail, {
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
        this.setState({ pastBids: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  fetchPastPaychecks = async () => {
    await fetch("/paychecks/" + this.props.caretakerEmail, {
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
        this.setState({ pastPaychecks: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  render() {
    const { isLoading, pastPaychecks, pastBids } = this.state;
    // const {  } = this.props;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <h1>Caretaker Past History Page</h1>
            <h2>Past Successful Bids</h2>
            <MaterialTable
              columns={this.state.bidColumns}
              data={pastBids}
              title="Past Successful Bids"
              options={{
                actionsColumnIndex: -1,
              }}
            />
            <h2>Past Paychecks</h2>
            <MaterialTable
              columns={this.state.paycheckColumns}
              data={pastPaychecks}
              title="Past Paychecks"
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
