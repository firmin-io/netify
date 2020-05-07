import React, { Component } from "react";
import Modal from "react-modal";
import ModalsContext from "./contexts/modalsContext";
import Loader from "./loader";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
    zIndex: "999",
    backgroundColor: "transparent",
    border: "none",
  },
};

Modal.setAppElement("#modals");

class Modals extends Component {
  state = {
    showErrorModal: false,
    errorModalContent: undefined,
    showWarningModal: false,
    warningModalContent: undefined,
    showMessageModal: false,
    messageModalContent: undefined,
    showLoadingModal: false,
  };

  closeErrorModal = () => {
    let _state = this.state;
    _state.errorModalContent = "";
    _state.showErrorModal = false;
    this.setState(_state);
  };

  closeMessageModal = () => {
    let _state = this.state;
    _state.messageModalContent = "";
    _state.showMessageModal = false;
    this.setState(_state);
  };

  closeWarningModal = () => {
    let _state = this.state;
    _state.warningModalContent = "";
    _state.showWarningModal = false;
    this.setState(_state);
    if (this.state.warningCallback) {
      //console.log("calling callback");
      this.state.warningCallback();
    }
  };

  closeWarningModalWithouCallback = () => {
    let _state = this.state;
    _state.warningModalContent = "";
    _state.showWarningModal = false;
    this.setState(_state);
  };

  openErrorModal = (content) => {
    this.closeAllModals();
    //console.log(content);
    let _state = this.state;
    _state.errorModalContent = <h4>{content}</h4>;
    _state.showErrorModal = true;
    this.setState(_state);
  };

  openLoadingModal = () => {
    this.closeAllModals();
    let _state = this.state;
    _state.showLoadingModal = true;
    this.setState(_state);
  };

  closeLoadingModal = () => {
    let _state = this.state;
    _state.showLoadingModal = false;
    this.setState(_state);
  };

  closeAllModals = () => {
    let _state = this.state;
    _state.showLoadingModal = false;
    _state.showErrorModal = false;
    _state.showMessageModal = false;
    _state.showWarningModal = false;
    this.setState(_state);
  };

  openMessageModal = (content) => {
    this.closeAllModals();
    let _state = this.state;
    _state.messageModalContent = content;
    _state.showMessageModal = true;
    this.setState(_state);
  };

  openWarningModal = (content, callback) => {
    this.closeAllModals();
    let _state = this.state;
    _state.warningModalContent = <h4>{content}</h4>;
    _state.showWarningModal = true;
    _state.warningCallback = callback;
    //console.log(_state);
    this.setState(_state);
  };

  render() {
    return (
      <ModalsContext.Provider
        value={{
          openErrorModal: this.openErrorModal,
          closeErrorModal: this.closeErrorModal,
          openMessageModal: this.openMessageModal,
          closeMessageModal: this.closeMessageModal,
          openWarningModal: this.openWarningModal,
          closeWarningModal: this.closeWarningModal,
          openLoadingModal: this.openLoadingModal,
          closeLoadingModal: this.closeLoadingModal,
        }}
      >
        <React.Fragment>
          <Modal
            isOpen={this.state.showErrorModal}
            onRequestClose={this.closeErrorModal}
            contentLabel="error modal"
            key="errorModal"
            style={modalStyles}
          >
            <div className="bg-red-100 border-2 rounded-lg border-red-300">
              <p className="font-semibold text-red-500 text-center mt-2">
                Error
              </p>
              <div className="text-base text-red-500 my-4 mx-4">
                {this.state.errorModalContent}
              </div>

              <div className="flex justify-end py-1 mr-4 mb-2">
                <button
                  className="inline-block text-base px-4 py-2 leading-none  rounded bg-red-500 text-white hover:bg-white hover:text-red-500 lg:mt-0"
                  type="submit"
                  onClick={this.closeErrorModal}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={this.state.showLoadingModal}
            contentLabel="loading modal"
            key="loadingModal"
            style={modalStyles}
          >
            <div className="bg-orange-100 border-2 rounded-lg border-orange-300 p-4">
              <p className="font-semibold text-blue-500 text-center">
                Processing...
              </p>
              <div className="m-5">
                <Loader />
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={this.state.showMessageModal}
            onRequestClose={this.closeMessageModal}
            style={modalStyles}
            contentLabel="message modal"
            key="messageModal"
          >
            <div className="bg-green-100 border-2 rounded-lg border-green-300">
              <p className="font-semibold text-green-500 text-center mt-2">
                Message
              </p>
              <div className="text-base text-green-500 my-4 mx-4">
                {this.state.messageModalContent}
              </div>

              <div className="flex justify-end py-1 mr-4 mb-2">
                <button
                  className="inline-block text-base px-4 py-2 leading-none  rounded bg-green-500 text-white hover:bg-white hover:text-green-500 lg:mt-0"
                  onClick={this.closeMessageModal}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={this.state.showWarningModal}
            onRequestClose={this.closeWarningModalWithouCallback}
            style={modalStyles}
            contentLabel="warning modal"
            key="warningModal"
          >
            <div className="bg-yellow-100 border-2 rounded-lg border-yellow-300">
              <p className="font-semibold text-yellow-500 text-center mt-2">
                Warning
              </p>
              <div className="text-base text-yellow-500 my-4 mx-4">
                {this.state.warningModalContent}
              </div>

              <div className="flex justify-end py-1 mr-4 mb-2">
                <button
                  className="inline-block text-base px-4 py-2 leading-none rounded bg-yellow-500 text-white hover:bg-white hover:text-yellow-500 mr-4 lg:mt-0"
                  type="submit"
                  onClick={this.closeWarningModalWithouCallback}
                >
                  Cancel
                </button>
                <button
                  className="inline-block text-base px-4 py-2 leading-none rounded bg-yellow-500 text-white hover:bg-white hover:text-yellow-500 lg:mt-0"
                  type="submit"
                  onClick={this.closeWarningModal}
                >
                  Continue
                </button>
              </div>
            </div>
          </Modal>
        </React.Fragment>
        {this.props.children}
      </ModalsContext.Provider>
    );
  }
}

export default Modals;
