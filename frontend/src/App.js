import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import MainPage from "./MainPage";
import Home from "./components/Home";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        {/* <Route exact path="/" component={MainPage} /> */}
        <Route exact path="/" component={Home} />
      </Router>
    );
  }
}
