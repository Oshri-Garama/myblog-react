import React from 'react'
import './AlertMessage.css'
import successSVG from "../../images/icons/success.svg";
import failedSVG from "../../images/icons/failed.svg";


const AlertMessage = (props) => {
  const { message, type } = props
  let SVG;
  if (type === 'success') {
    SVG = successSVG
  }
  else if (type === 'failed') {
    SVG = failedSVG
  }
  return (
    <div class="alert-message-container">
      <img class='svg-alert' src={SVG} />
      <text class='alert-message'>{message}</text>
    </div>
  );
} 



export default AlertMessage;
