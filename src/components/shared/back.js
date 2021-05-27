import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Back extends Component {
    handleNavigation = () => {
        this.props.history.goBack();
    };

    render() {
        return (
            <button
                disabled={this.props.isDisabled}
                className="btn-theme btn-transparent back-btn"
                onClick={this.handleNavigation}
            >
                Go Back
            </button>
        );
    }
}

export default withRouter(Back);
