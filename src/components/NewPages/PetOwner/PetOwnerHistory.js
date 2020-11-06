import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";
import Loading from "../../Layout/Loading";
import { convertDateTimeToYYYYMMdd } from "../../../common";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class PetOwnerHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      bidColumns: [
        {
          title: "Care-taker Email",
          field: "care_taker_email",
        },
        { title: "Pet Name", field: "pet_name" },
        {
          title: "Success Status",
          field: "success_status",
        },
        {
          title: "Start Date",
          field: "start_date",
        },
        {
          title: "End Date",
          field: "end_date",
        },
        {
          title: "Rating",
          field: "rating",
        },
        {
          title: "Review",
          field: "review",
          validate: (rowData) =>
            rowData.review.length < 3 ? "Leave at least a few words!" : "",
        },
        {
          title: "Payment Method",
          field: "payment_method",
        },
        {
          title: "Delivery Method",
          field: "delivery_method",
        },
      ],
      bids: [],
    };
  }

  componentDidMount = async () => {
    await this.fetchMyBids();
    this.setState({
      isLoading: false,
    });
  };

  fetchMyBids = async () => {
    await fetch("/pet_owner_success_bids/" + this.props.petOwnerEmail, {
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
        this.setState({ bids: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  handleCreateReview = async (newData) => {
    await fetch(
      "/bids/" +
        newData.care_taker_email +
        "/" +
        newData.pet_owner_email +
        "/" +
        newData.pet_name +
        "/" +
        convertDateTimeToYYYYMMdd(newData.start_date) +
        "/" +
        convertDateTimeToYYYYMMdd(newData.end_date) +
        "/" +
        newData.price,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newData,
        }),
      }
    )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        console.log(data);
        this.setState({ isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  render() {
    const { isLoading } = this.state;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <h1>Pet Owner History Page</h1>
            <h2>Previous Successful Bids</h2>
            <h5>Hint: Leave reviews under Actions Column!</h5>
            <MaterialTable
              columns={this.state.bidColumns}
              data={this.state.bids}
              title="My Successful Bids"
              options={{
                actionsColumnIndex: -1,
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataUpdate = [...this.state.bids];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      this.setState({
                        bids: dataUpdate,
                      });
                      this.handleCreateReview(newData);
                      resolve();
                    }, 1000);
                  }),
              }}
            />
          </VerticalWrapper>
        )}
      </>
    );
  }
}
