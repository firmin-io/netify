import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import { readUserData, saveUserData, clearUserData } from "../common/utils";
import { apiWrapper } from "../common/utils";
import N3tifyService from "../services/n3tify";
import ModalsContext from "./contexts/modalsContext";
import { timeout } from "../common/utils";

class Global extends Component {
  static contextType = ModalsContext;
  state = {
    isLoggedIn: false,
    token: undefined,
    email: undefined,
    id: undefined,
    modals: undefined,
  };

  setUserData = (json) => {
    let _state = this.state;
    _state.email = json.email;
    _state.isLoggedIn = true;
    saveUserData({
      email: json.email,
    });
    this.setState(_state);
  };

  logout = async () => {
    await this.wrapInLoader(() => {
      clearUserData();
      let _state = this.state;
      _state.email = undefined;
      _state.isLoggedIn = false;
      this.setState(_state);
    });
  };

  login = async (email, password) => {
    const req = {
      body: {
        email: email,
        password: password,
      },
    };

    await this.wrapInLoader(async () => {
      await apiWrapper(
        N3tifyService.login,
        req,
        (json) => {
          this.setUserData({ email: email });
        },
        this.context.openErrorModal
      );
    });
  };

  loadData = () => {
    let data = readUserData();
    if (data) {
      let _state = this.state;
      _state.isLoggedIn = true;
      _state.email = data.email;
    }
  };

  constructor() {
    super();
    this.loadData();
  }

  wrapInLoader = async (func) => {
    await this.context.openLoadingModal();
    await timeout(150);
    let r = await func();
    await timeout(150);
    await this.context.closeLoadingModal();
    return r;
  };

  render() {
    return (
      <ModalsContext.Consumer>
        {(modals) => {
          return (
            <GlobalContext.Provider
              value={{
                utils: {
                  loaderWrapper: this.wrapInLoader,
                },
                modals: modals,
                user: {
                  token: this.state.token,
                  email: this.state.email,
                  isLoggedIn: this.state.isLoggedIn,
                  id: this.state.id,
                  login: this.login,
                  logout: this.logout,
                  signUp: this.signUp,
                },
              }}
            >
              {this.props.children}
            </GlobalContext.Provider>
          );
        }}
      </ModalsContext.Consumer>
    );
  }
}

export default Global;
