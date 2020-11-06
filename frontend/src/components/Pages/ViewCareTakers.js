import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import Loading from "../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class ViewCareTakers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      columns: [{ title: "Email", field: "email" }],
    };
  }

  componentDidMount = async () => {
    await this.fetchAllCareTakers();
  };

  fetchAllCareTakers = async () => {
    await fetch("/caretaker")
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        this.setState({ data: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  handleDeleteOwner = (email) => {
    console.log(email);
  };

  render() {
    const { isLoading } = this.state;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <Button color="secondary" onClick={this.fetchAllCareTakers}>
              Refresh
            </Button>
            <MaterialTable
              columns={this.state.columns}
              data={this.state.data}
              title="All Pet Owners"
              options={{
                actionsColumnIndex: -1,
              }}
              editable={{
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                      });
                      this.handleDeleteOwner(oldData.email);
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
