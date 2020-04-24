import React, { Component } from "react";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import GlobalContext from "./contexts/globalContext";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    zIndex: "999",
    backgroundColor: "transparent",
    border: "none",
  },
};

Modal.setAppElement("#modals");

class NavBar extends Component {
  static contextType = GlobalContext;

  state = {
    loginModalIsOpen: false,
    email: undefined,
    password: undefined,
    firstName: undefined,
    lastName: undefined,
    userId: undefined,
    menuClasses: "hidden",
    mobile: false,
  };

  closeLoginModal = () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;
    this.setState(_state);
  };

  openLoginModal = () => {
    let _state = this.state;
    _state.loginModalIsOpen = true;
    this.setState(_state);
  };

  login = async () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;
    this.setState(_state);

    await this.context.user.login(this.state.email, this.state.password);
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  logout = async () => {
    let _state = this.state;
    _state.loginModalIsOpen = false;

    this.setState(_state);
    await this.context.user.logout();
  };

  getLoginButton = () => {
    if (this.context.user.isLoggedIn) {
      return (
        <button
          className="inline-block text-sm px-4 py-2 leading-none border rounded text-orange-500 border-orange-500 hover:border-transparent hover:text-white hover:bg-blue-500 mt-4 mr-4 lg:mt-0"
          onClick={this.logout}
        >
          Sign out
        </button>
      );
    }

    return (
      <React.Fragment>
        <button
          onClick={this.openLoginModal}
          className="inline-block text-sm px-4 py-2 leading-none border rounded text-orange-500 border-orange-500 hover:border-transparent hover:text-white hover:bg-blue-500 mt-4 mr-4 lg:mt-0"
        >
          Sign in
        </button>
      </React.Fragment>
    );
  };

  toggleMenuVisibility = () => {
    let _state = this.state;
    if (_state.menuClasses === "") {
      _state.menuClasses = "hidden";
    } else {
      _state.menuClasses = "";
    }
    _state.mobile = true;
    this.setState(_state);
  };

  preRouting = () => {
    if (this.state.mobile) {
      this.toggleMenuVisibility();
    }
  };

  render() {
    return (
      <React.Fragment>
        <nav className="flex items-center justify-between flex-wrap p-4 border-b border-gray-300">
          <div className="flex items-center flex-shrink-0 text-blue-600 mr-6 ml-2">
            <NavLink
              exact
              onClick={this.preRouting}
              to="/"
              activeClassName="border-b border-orange-500"
              className="font-semibold text-xl tracking-tight"
            >
              N3tify
            </NavLink>
          </div>
          <div className="block lg:hidden xl:hidden">
            <button
              className="flex items-center px-3 py-2 border rounded text-orange-200 border-orange-400 hover:text-blue-500 hover:border-blue-500"
              onClick={this.toggleMenuVisibility}
            >
              <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div
            className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${this.state.menuClasses}`}
          >
            <div className="text-sm lg:flex-grow"></div>
            <div>{this.getLoginButton()}</div>
          </div>
        </nav>

        <Modal
          isOpen={this.state.loginModalIsOpen}
          onRequestClose={this.closeLoginModal}
          style={modalStyles}
          contentLabel="login modal"
          key="loginModal"
        >
          <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-sm mx-auto">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="alfred@bat.cave"
                onChange={(e) => this.handleChange("email", e)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                onChange={(e) => this.handleChange("password", e)}
                placeholder="******************"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={(e) => this.login()}
              >
                Sign In
              </button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default NavBar;
