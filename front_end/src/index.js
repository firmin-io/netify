import React from "react";
import ReactDOM from "react-dom";
import "./css/tailwind.css";
import "./index.css";
import Main from "./components/main";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import NavBar from "./components/navbar";
import Global from "./components/global";
import Modals from "./components/modals";
import Container from "./components/container";

const routing = (
  <Modals>
    <Global>
      <Router>
        <NavBar></NavBar>
        <Container>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Container>
      </Router>
    </Global>
  </Modals>
);

ReactDOM.render(routing, document.getElementById("root"));
