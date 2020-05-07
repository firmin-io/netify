import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import N3tifyService from "../services/n3tify";
import { apiWrapper } from "../common/utils";
import { emailRegex, phoneRegex, nameRegex } from "../common/validation";

class User extends Component {
  static contextType = GlobalContext;

  constructor(props, context) {
    super(props, context);
    if (this.props.user) {
      this.state = {
        first_name: this.props.user.first_name,
        last_name: this.props.user.last_name,
        phone_number: this.props.user.phone_number,
        email: this.props.user.email,
      };
    } else {
      this.state = {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
      };
    }
  }

  createButton = () => {
    return (
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={(e) => this.createUser()}
      >
        Add User
      </button>
    );
  };

  createUser = async () => {
    const allEmpty = [
      this.state.phone_number,
      this.state.email,
      this.state.first_name,
      this.state.last_name,
    ].every((it) => it.length < 1);

    if (allEmpty) {
      alert("The form must be filled.");
      return;
    }

    if (!emailRegex.test(this.state.email)) {
      alert("Provide a valid email");
      return;
    }

    if (
      !phoneRegex.test(this.state.phone_number) ||
      this.state.phone_number === "000-000-0000"
    ) {
      alert("Provide a valid phone number like 123-456-7890");
      return;
    }

    if (
      this.state.first_name.length < 1 ||
      this.state.last_name.length < 1 ||
      !nameRegex.test(this.state.first_name) ||
      !nameRegex.test(this.state.last_name)
    ) {
      alert("Provide a valid name");
      return;
    }

    const req = {
      body: {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
      },
    };
    this.props.closeModal();
    await this.context.utils.loaderWrapper(async () => {
      await apiWrapper(
        N3tifyService.createUser,
        req,
        (json) => {
          this.props.onCreate(json);
        },
        this.context.modals.openErrorModal,
        this.context.user.logout
      );
    });
  };

  editUser = async () => {
    let req = {
      body: {
        id: this.props.user.id,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
      },
    };
    this.props.closeModal();
    await this.context.utils.loaderWrapper(async () => {
      await apiWrapper(
        N3tifyService.editUser,
        req,
        (json) => {
          this.props.onEdit(json);
        },
        this.context.modals.openErrorModal,
        this.context.user.logout
      );
    });
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  editButton = () => {
    return (
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={(e) => this.editUser()}
      >
        Save User
      </button>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-sm mx-auto">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="fname"
            >
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fname"
              type="text"
              value={this.state.first_name}
              placeholder={
                this.props.user ? this.props.user.first_name : "Bruce"
              }
              onChange={(e) => this.handleChange("first_name", e)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="lname"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lname"
              type="text"
              value={this.state.last_name}
              onChange={(e) => this.handleChange("last_name", e)}
              placeholder={
                this.props.user ? this.props.user.last_name : "Wayne"
              }
            />
          </div>
          <div className="mb-6">
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
              value={this.state.email}
              onChange={(e) => this.handleChange("email", e)}
              placeholder={
                this.props.user ? this.props.user.email : "bruce@waynecorp.com"
              }
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="tel"
            >
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tel"
              type="tel"
              value={this.state.phone_number}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={(e) => this.handleChange("phone_number", e)}
              placeholder={
                this.props.user ? this.props.user.phone_number : "123-123-1234"
              }
            />
          </div>
          <div className="flex items-center justify-end">
            {this.props.user ? this.editButton() : this.createButton()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default User;
