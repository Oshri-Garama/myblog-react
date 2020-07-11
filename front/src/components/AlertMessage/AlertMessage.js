import React from "react";
import "./AlertMessage.css";
import successSVG from "../../images/icons/success.svg";
import failedSVG from "../../images/icons/failed.svg";

class AlertMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPopupIfNeeded = () => {
    const { message, type } = this.props;
    if (message) {
      let SVG;
      if (type === "success") {
        SVG = successSVG;
      } else if (type === "failed") {
        SVG = failedSVG;
      }
      return (
        <div className="alert-message-container">
          <img className="svg-alert" src={SVG} />
          <p className="alert-message">{message}</p>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      this.renderPopupIfNeeded()
    );
  }
}

export default AlertMessage;
