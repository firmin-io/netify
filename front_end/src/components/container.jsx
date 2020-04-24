import React, { Component } from "react";

class Container extends Component {
  state = {};
  render() {
    return (
      <div className="qm-bg w-screen h-screen">
        <div className="mx-auto px-6 my-6 bg-transparent container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Container;
