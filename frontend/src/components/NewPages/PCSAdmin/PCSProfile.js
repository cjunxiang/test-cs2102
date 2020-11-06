import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Loading from "../../Layout/Loading";

const VerticalWrapper = styled.div`
  background-color: #f2f7f7;
  padding: 20px;
`;

export class PCSProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount = async () => {
    await this.fetchUserName();
    this.setState({
      isLoading: false,
    });
  };

  fetchUserName = async () => {
    await fetch("/users/" + this.props.PCSEmail, {
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

  render() {
    const { isLoading, name } = this.state;
    const { PCSEmail, userType } = this.props;
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <VerticalWrapper>
            <h1>Admin Profile Page</h1>
            <h2>My Profile</h2>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {name}
                </Typography>
                <Typography color="textSecondary">{userType}</Typography>
                <Typography variant="body2" component="p">
                  {PCSEmail}
                </Typography>
              </CardContent>
            </Card>
          </VerticalWrapper>
        )}
      </>
    );
  }
}
