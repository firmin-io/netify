import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import N3tifyService from "../services/n3tify";
import { apiWrapper } from "../common/utils";

class Message extends Component {
  static contextType = GlobalContext;

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  createMessage = async () => {
    const req = {
      body: {
        subject: this.state.subject,
        message: this.state.message,
      },
    };
    this.props.closeModal();
    await this.context.utils.loaderWrapper(async () => {
      await apiWrapper(
        N3tifyService.createMessage,
        req,
        (json) => {
          this.props.onCreate(json);
        },
        this.context.modals.openErrorModal,
        this.context.user.logout
      );
    });
  };

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 max-w-sm mx-auto">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="subject"
            >
              Subject
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="subject"
              type="text"
              placeholder="Subject"
              onChange={(e) => this.handleChange("subject", e)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="message"
            >
              Message
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Message"
              aria-label="message"
              onChange={(e) => this.handleChange("message", e)}
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={(e) => this.createMessage()}
            >
              Create Message
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Message;
