import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MaterialTable from "material-table";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { getTodayDateString } from "../../../common";

import Loading from "../../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class CaretakerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      petDayMonth: 9,
      petDayYear: 2020,
      salaryMonth: 9,
      salaryYear: 2020,
      petDays: [],
      petDay: [],
      expectedSalaries: [],
      expectedSalary:
        "Either this month has no entries or you have yet to select a month or year. Try Again with a new option",
      petColumns: [
        { title: "Owner Email", field: "pet_owner_email" },
        { title: "Name", field: "pet_name" },
        { title: "Special Requirements", field: "special_requirements" },
        { title: "Type", field: "category" },
        { title: "Descriptions", field: "profile" },
      ],
      pets: [],
      employment: "null",
    };
  }

  componentDidMount = async () => {
    await this.fetchUserName();
    await this.fetchEmploymentType();
    await this.fetchCurrentPets();
    await this.fetchPetDays();
    await this.fetchEmploymentType();
    await this.filterUserPetDay();
    if (this.state.employment === "full-time caretaker") {
      await this.fetchFullTimeSalary();
      await this.filterUserExpectedSalary();
      this.setState({
        isLoading: false,
      });
    } else if (this.state.employment === "part-time caretaker") {
      await this.fetchPartTimeSalary();
      this.setState({
        isLoading: false,
      });
    }
  };

  fetchUserName = async () => {
    await fetch("/users/" + this.props.caretakerEmail, {
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

  fetchPetDays = async () => {
    await fetch("/petdays/" + this.props.caretakerEmail, {
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
        this.setState({ petDays: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  fetchPartTimeSalary = async () => {
    if (this.state.employment === "part-time caretaker") {
      await fetch("/parttimesalary/" + this.props.caretakerEmail, {
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
          this.setState({ expectedSalaries: data, isLoading: false });
        })
        .catch((error) => console.log(`Caught promise: ${error}`));
    } else {
      console.alert("CANNOT FETCH PART TIME SALARY! NOT PART TIMER");
    }
  };

  fetchFullTimeSalary = async () => {
    if (this.state.employment === "full-time caretaker") {
      await fetch("/fulltimesalary/" + this.props.caretakerEmail, {
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
          this.setState({ expectedSalaries: data, isLoading: false });
        })
        .catch((error) => console.log(`Caught promise: ${error}`));
    } else {
      console.alert("NOT FULLTIME, CANNOT CALCULATE SALARY");
    }
  };

  fetchCurrentPets = async () => {
    await fetch(
      "/bids/" + this.props.caretakerEmail + "/" + getTodayDateString(),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ pets: data, isLoading: false });
      })
      .catch((error) => console.log(`Caught promise: ${error}`));
  };

  changePetDayYear = (e) => {
    this.setState(
      {
        petDayYear: e.target.value,
      },
      () => {
        this.filterUserPetDay();
      }
    );
  };

  changePetDayMonth = (e) => {
    this.setState(
      {
        petDayMonth: e.target.value,
      },
      () => {
        this.filterUserPetDay();
      }
    );
  };

  changeSalaryYear = (e) => {
    this.setState(
      {
        salaryYear: e.target.value,
      },
      () => {
        this.filterUserExpectedSalary();
      }
    );
  };

  changeSalaryMonth = (e) => {
    this.setState(
      {
        salaryMonth: e.target.value,
      },
      () => {
        this.filterUserExpectedSalary();
      }
    );
  };

  filterUserExpectedSalary = async () => {
    const { expectedSalaries, salaryMonth, salaryYear } = this.state;
    const found = expectedSalaries.find((salary) => {
      return (
        salary.month === salaryMonth + 1 &&
        salary.year === salaryYear.toString()
      );
    });
    this.setState({
      expectedSalary: found
        ? found.expected_salary
        : "Either this month has no entries or you have yet to select a month or year. Try Again with a new option",
    });
  };

  filterUserPetDay = async () => {
    const { petDays, petDayMonth, petDayYear } = this.state;
    const found = petDays.find((petDay) => {
      return (
        petDay.month === petDayMonth + 1 &&
        petDay.year === petDayYear.toString()
      );
    });
    console.log(found);
    this.setState({
      petDay: found
        ? found
        : "Either this month has no entries or you have yet to select a month or year. Try Again with a new option",
    });
  };

  render() {
    const {
      isLoading,
      name,
      petDayMonth,
      petDayYear,
      salaryMonth,
      expectedSalary,
      salaryYear,
      petDay,
      pets,
      employment,
    } = this.state;
    const { caretakerEmail } = this.props;

    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <h1>Caretaker Profile Page</h1>
            <h2>My Profile</h2>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {name}
                </Typography>
                <Typography color="textSecondary">{employment}</Typography>
                <Typography variant="body2" component="p">
                  {caretakerEmail}
                </Typography>
              </CardContent>
            </Card>
            <h2>My Pet Days</h2>
            <Card>
              <CardContent>
                <FormControl>
                  <InputLabel>
                    <b>Month</b>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={petDayMonth}
                    onChange={this.changePetDayMonth}
                  >
                    <MenuItem value={0}>January</MenuItem>
                    <MenuItem value={1}>Feburary</MenuItem>
                    <MenuItem value={2}>March</MenuItem>
                    <MenuItem value={3}>April</MenuItem>
                    <MenuItem value={4}>May</MenuItem>
                    <MenuItem value={5}>June</MenuItem>
                    <MenuItem value={6}>July</MenuItem>
                    <MenuItem value={7}>August</MenuItem>
                    <MenuItem value={8}>September</MenuItem>
                    <MenuItem value={9}>October</MenuItem>
                    <MenuItem value={10}>November</MenuItem>
                    <MenuItem value={11}>December</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>
                    <b>Year</b>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={petDayYear}
                    onChange={this.changePetDayYear}
                  >
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                  </Select>
                </FormControl>
                <hr />
                <Typography color="textSecondary">
                  Number of Pet Days for {petDayMonth + 1}/{petDayYear}
                </Typography>
                <Typography variant="body2" component="p">
                  {petDay ===
                  "Either this month has no entries or you have yet to select a month or year. Try Again with a new option"
                    ? petDay
                    : petDay.monthly_pet_days}
                </Typography>
                <Typography color="textSecondary">Average Price</Typography>
                <Typography variant="body2" component="p">
                  {petDay ===
                  "Either this month has no entries or you have yet to select a month or year. Try Again with a new option"
                    ? petDay
                    : petDay.avg_price}
                </Typography>
              </CardContent>
            </Card>

            <h2>My Expected Salary</h2>
            <Card>
              <CardContent>
                <FormControl>
                  <InputLabel>
                    <b>Month</b>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={salaryMonth}
                    onChange={this.changeSalaryMonth}
                  >
                    <MenuItem value={0}>January</MenuItem>
                    <MenuItem value={1}>Feburary</MenuItem>
                    <MenuItem value={2}>March</MenuItem>
                    <MenuItem value={3}>April</MenuItem>
                    <MenuItem value={4}>May</MenuItem>
                    <MenuItem value={5}>June</MenuItem>
                    <MenuItem value={6}>July</MenuItem>
                    <MenuItem value={7}>August</MenuItem>
                    <MenuItem value={8}>September</MenuItem>
                    <MenuItem value={9}>October</MenuItem>
                    <MenuItem value={10}>November</MenuItem>
                    <MenuItem value={11}>December</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>
                    <b>Year</b>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={salaryYear}
                    onChange={this.changeSalaryYear}
                  >
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                  </Select>
                </FormControl>
                <hr />
                <Typography color="textSecondary">
                  Expected Salary for {salaryMonth + 1}/{salaryYear}
                </Typography>
                <Typography variant="body2" component="p">
                  {expectedSalary}
                </Typography>
              </CardContent>
            </Card>
            <h2>There are {pets.length} pets you're taking Care of Now</h2>
            <MaterialTable
              columns={this.state.petColumn}
              data={pets}
              title="Current Pets"
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
