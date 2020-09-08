import React from "react";
import "./AlertMessage.css";
import successSVG from "../../images/icons/success.svg";
import failedSVG from "../../images/icons/failed.svg";

const AlertMessage = (props) => {
  const { message, type } = props;

  if (message) {
    let SVG;
    if (type === "success") {
      SVG = successSVG;
    } else if (type === "failed") {
      SVG = failedSVG;
    }
    return (
      <div id="alert-message-width" className="alert-message-container">
        <img className="svg-alert" src={SVG} />
        <p className="alert-message">{message}</p>
      </div>
    );
  } else {
    return null;
  }
}

export default AlertMessage;
