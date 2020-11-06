import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import Loading from "../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class ViewBids extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      columns: [
        { title: "Caretaker Email", field: "care_taker_email" },
        { title: "Delivery Method", field: "delivery_method" },
        { title: "price", field: "price" },
        { title: "success", field: "success_status" },
        { title: "year", field: "year" },
        { title: "pet name", field: "pet_name" },
        { title: "start date", field: "start_date" },
        { title: "payment method", field: "payment_method" },
      ],
    };
  }

  componentDidMount = async () => {
    await this.fetchAllBids();
  };

  fetchAllBids = async () => {
    await fetch("/bids")
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({ data: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  handleDeleteBid = (newData, oldData) => {};
  handleTableUpdate = (oldDataId) => {};

  render() {
    const { isLoading } = this.state;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <Button color="secondary" onClick={this.fetchAllBids}>
              Refresh
            </Button>
            <MaterialTable
              columns={this.state.columns}
              data={this.state.data}
              title="Bids"
              options={{
                actionsColumnIndex: -1,
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        this.setState((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data };
                        });
                      }
                      this.handleTableUpdate(newData, oldData);
                    }, 600);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                      });
                      this.handleDeleteBid(oldData._id);
                    }, 600);
                  }),
              }}
            />
          </VerticalWrapper>
        )}
      </>
    );
  }
}
