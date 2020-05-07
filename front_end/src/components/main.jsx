import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import N3tifyService from "../services/n3tify";
import { apiWrapper } from "../common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";

import { faTrash, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import User from "./user";
import Message from "./message";

const activeTab = "text-orange-600";

const inactiveTab = "text-gray-400";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    zIndex: "999",
    backgroundColor: "transparent",
    border: "none",
  },
};

Modal.setAppElement("#modals");

class Main extends Component {
  static contextType = GlobalContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      usersTabActive: true,
      messagesTabActive: false,
      usersTab: activeTab,
      messagesTab: inactiveTab,
      users: [],
      messages: [],
      modal: false,
      modalObj: undefined,
    };

    this.loadMessages();
    this.loadUsers();
  }

  loadUsers = () => {
    apiWrapper(
      N3tifyService.getMessages,
      {},
      (json) => {
        this.setState({ messages: json });
      },
      this.context.modals.openErrorModal,
      () => {
        this.context.modals.openErrorModal("Try again later");
      }
    );
  };

  deleteUser = (user_id) => {
    this.context.modals.openWarningModal(
      "Are you sure you want to delete this user? This action cannot be undone.",
      async () => {
        await this.context.utils.loaderWrapper(() => {
          apiWrapper(
            N3tifyService.deleteUser,
            { user_id },
            (json) => {
              let users = this.state.users;
              users = users.filter((u) => u.id !== user_id);
              this.setState({ users });
            },
            this.context.modals.openErrorModal,
            this.context.user.logout
          );
        });
      }
    );
  };

  createUser = () => {
    this.setState({
      modalObj: (
        <User
          closeModal={() => {
            this.setState({ modal: false });
          }}
          onCreate={(user) => {
            this.state.users.push(user);
            this.setState({ users: this.state.users, modal: false });
          }}
        />
      ),
      modal: true,
    });
  };

  createMessage = () => {
    this.setState({
      modalObj: (
        <Message
          closeModal={() => {
            this.setState({ modal: false });
          }}
          onCreate={(msg) => {
            this.state.messages.push(msg);
            this.setState({ messages: this.state.messages, modal: false });
          }}
        />
      ),
      modal: true,
    });
  };

  editUser = (user) => {
    this.setState({
      modalObj: (
        <User
          closeModal={() => {
            this.setState({ modal: false });
          }}
          user={user}
          onEdit={(user) => {
            let users = this.state.users;
            users = users.filter((u) => u.id !== user.id);
            users.push(user);
            this.setState({ users, modal: false });
          }}
        />
      ),
      modal: true,
    });
  };

  loadMessages = () => {
    apiWrapper(
      N3tifyService.getUsers,
      {},
      (json) => {
        this.setState({ users: json });
      },
      this.context.modals.openErrorModal,
      () => {
        this.context.modals.openErrorModal("Try again later");
      }
    );
  };

  toggleTabs = (mode) => {
    if (mode === "messages") {
      this.setState({
        usersTab: inactiveTab,
        usersTabActive: false,
        messagesTab: activeTab,
        messagesTabActive: true,
      });
      return;
    }

    this.setState({
      usersTab: activeTab,
      usersTabActive: true,
      messagesTab: inactiveTab,
      messagesTabActive: false,
    });
  };

  renderTabs = () => {
    if (!this.context.user.isLoggedIn) {
      return (
        <div className="min-h-full min-w-full flex justify-center">
          <div className="p-auto m-auto pt-32">
            <p className="text-blue-500 text-6xl">Please sign in to continue</p>
          </div>
        </div>
      );
    }
    return (
      <React.Fragment>
        <ul className="flex border-b">
          <li className="-mb-px mr-2 focus:outline-none">
            <div
              className={
                this.state.usersTabActive ? "border-b border-white" : ""
              }
            >
              <button
                className={
                  "bg-white focus:outline-none inline-block border-l border-t border-r rounded-t py-2 px-4 font-semibold " +
                  this.state.usersTab
                }
                onClick={(e) => this.toggleTabs("users")}
              >
                Users
              </button>
            </div>
          </li>
          <li className="-mb-px mr-1 focus:outline-none">
            <div
              className={
                this.state.messagesTabActive ? "border-b border-white" : ""
              }
            >
              <button
                className={
                  "bg-white focus:outline-none inline-block border-l border-t border-r rounded-t py-2 px-4 font-semibold " +
                  this.state.messagesTab
                }
                onClick={(e) => this.toggleTabs("messages")}
              >
                Messages
              </button>
            </div>
          </li>
        </ul>

        {this.state.usersTabActive ? this.usersTab() : this.messagesTab()}
      </React.Fragment>
    );
  };

  usersTab = () => {
    return (
      <div className="bg-white min-w-full min-h-full border-l border-r rounded-b border-b pl-4 pr-4 pb-16 text-gray-700">
        <div className="pl-5 pt-5 pb-5">
          <button
            title="create message"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-blue-500 border-blue-500 hover:border-transparent hover:text-white hover:bg-orange-500 mt-4 mr-4 lg:mt-0"
            onClick={this.createUser}
          >
            + User
          </button>
        </div>
        <div className="flex justify-center">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Time Created</th>
                <th className="px-4 py-2">Time Updated</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map((user) => {
                return (
                  <tr>
                    <td className="border-t-2 border-dotted px-4 py-2">
                      {user.first_name}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2">
                      {user.last_name}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2">
                      {user.phone_number}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2">
                      {user.create_time}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2">
                      {user.update_time}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2">
                      <div className="flex justify-between">
                        <button
                          title="edit"
                          className="block pr-2 focus:outline-none"
                          onClick={this.props.onDelete}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-blue-500 hover:text-orange-500"
                            onClick={() => this.editUser(user)}
                          />
                        </button>
                        <button
                          title="delete"
                          className="block pl-2 border-l-2 border-dotted focus:outline-none"
                          onClick={() => this.deleteUser(user.id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-blue-500 hover:text-orange-500"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  messagesTab = () => {
    return (
      <div className="bg-white min-w-full min-h-full border-l border-r rounded-b border-b pl-4 pr-4 pb-16 text-gray-700">
        <div className="pl-5 pt-5 pb-5">
          <button
            title="create message"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-blue-500 border-blue-500 hover:border-transparent hover:text-white hover:bg-orange-500 mt-4 mr-4 lg:mt-0"
            onClick={this.createMessage}
          >
            + Message
          </button>
        </div>
        <div className="flex justify-center">
          <table className="table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {this.state.messages.map((message) => {
                return (
                  <tr>
                    <td className="border-t-2 border-dotted px-4 py-2 w-1/5">
                      {message.subject}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2 w-3/5">
                      {message.message}
                    </td>
                    <td className="border-t-2 border-dotted px-4 py-2 w-1/5">
                      {message.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.renderTabs()}
        <Modal
          isOpen={this.state.modal}
          onRequestClose={() => this.setState({ modal: false })}
          style={modalStyles}
          contentLabel="n3tify modal"
          key="n3tifyModal"
        >
          <React.Fragment>
            <div className="flex justify-center">
              <button
                title="close"
                className="block pr-2 focus:outline-none"
                onClick={this.props.onDelete}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-orange-500 hover:text-blue-500"
                  onClick={() => this.setState({ modal: false })}
                />
              </button>
            </div>
            {this.state.modalObj}
          </React.Fragment>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Main;
