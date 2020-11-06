import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";

import Loading from "../../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class PCSHistory extends React.Component {
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
    };
  }

  componentDidMount = async () => {
    await this.fetchPastPaychecks();
    this.setState({
      isLoading: false,
    });
  };

  fetchPastPaychecks = async () => {
    await fetch("/paycheckspcs/" + this.props.PCSEmail, {
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
    const { isLoading, pastPaychecks } = this.state;
    // const {  } = this.props;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <h1>Admin Paychecks History Page</h1>
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
