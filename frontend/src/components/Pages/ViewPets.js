import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import Loading from "../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class ViewPets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      columns: [
        { title: "Owner Email", field: "pet_owner_email" },
        { title: "Name", field: "pet_name" },
        { title: "Special Requirements", field: "special_requirements" },
        { title: "Type", field: "category" },
        { title: "Descriptions", field: "profile" },
      ],
    };
  }

  componentDidMount = async () => {
    await this.fetchAllPets();
  };

  fetchAllPets = async () => {
    await fetch("/pets")
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
            <h1>View All Pets</h1>
            <Button color="secondary" onClick={this.fetchAllPets}>
              Refresh
            </Button>
            <MaterialTable
              columns={this.state.columns}
              data={this.state.data}
              title="All Pet Owners"
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
