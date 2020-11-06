import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";
import { convertDateTimeToYYYYMMdd } from "../../../common";
import Loading from "../../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class CaretakerLeave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      leaveDates: [],
      freeDates: [],
      leaveColumns: [
        {
          title: "Leave Dates",
          field: "unavailable_date",
        },
      ],
      freeColumns: [
        {
          title: "Available Dates",
          field: "free_date",
        },
      ],
    };
  }

  componentDidMount = async () => {
    await this.fetchEmploymentType();
    if (this.state.employment === "full-time caretaker") {
      await this.fetchLeaves();
    } else if (this.state.employment === "part-time caretaker") {
      await this.fetchFreeDays();
    }

    this.setState({
      isLoading: false,
    });
  };

  fetchEmploymentType = async () => {
    await fetch("/caretaker/" + this.props.caretakerEmail, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        this.setState({ employment: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  fetchLeaves = async () => {
    await fetch("/fulltimeschedule/" + this.props.caretakerEmail, {
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
        this.setState({ leaveDates: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  fetchFreeDays = async () => {
    await fetch("/parttimeschedule/" + this.props.caretakerEmail, {
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
        this.setState({ freeDates: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  createLeave = async (newData) => {
    await fetch("/fulltimeschedule/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unavailable_date: newData.unavailable_date,
        email: this.props.caretakerEmail,
      }),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        console.log(data);
        this.setState({ isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  createFreeDay = async (newData) => {
    await fetch("/parttimeschedule/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unavailable_date: newData.free_date,
        email: this.props.caretakerEmail,
      }),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        console.log(data);
        this.setState({ isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  deleteLeave = async (oldData) => {
    await fetch(
      "/fulltimeschedule/" +
        this.props.caretakerEmail +
        "/" +
        convertDateTimeToYYYYMMdd(oldData.unavailable_date),
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.text();
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  deleteFreeDay = async (oldData) => {
    await fetch(
      "/parttimeschedule/" +
        this.props.caretakerEmail +
        "/" +
        convertDateTimeToYYYYMMdd(oldData.unavailable_date),
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.text();
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  render() {
    const { isLoading, employment, leaveDates, freeDates } = this.state;
    // const {  } = this.props;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <h1>{employment} </h1>
            <h1>Leave Management Page</h1>
            <h3>Add Leave in format MM/DD/YYYY</h3>
            {employment === "full-time caretaker" && (
              <MaterialTable
                columns={this.state.leaveColumns}
                data={leaveDates}
                title="Your Leaves"
                options={{
                  actionsColumnIndex: -1,
                }}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.setState({ leaveDates: [...leaveDates, newData] });
                        this.createLeave(newData);
                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        this.setState((prevState) => {
                          const leaveDates = [...prevState.leaveDates];
                          leaveDates.splice(leaveDates.indexOf(oldData), 1);
                          return { leaveDates };
                        });
                        this.deleteLeave(oldData);
                        // this.handleTableDelete(oldData._id);
                      }, 600);
                    }),
                }}
              />
            )}
            {employment === "part-time caretaker" && (
              <MaterialTable
                columns={this.state.freeColumns}
                data={freeDates}
                title="Your availabilities"
                options={{
                  actionsColumnIndex: -1,
                }}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.setState({ free_date: [...freeDates, newData] });
                        this.createFreeDay(newData);
                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        this.setState((prevState) => {
                          const freeDates = [...prevState.freeDates];
                          freeDates.splice(freeDates.indexOf(oldData), 1);
                          return { ...prevState, freeDates };
                        });
                        this.deleteFreeDay(oldData);
                      }, 600);
                    }),
                }}
              />
            )}
          </VerticalWrapper>
        )}
      </>
    );
  }
}
