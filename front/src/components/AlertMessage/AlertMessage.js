import React from 'react'
import successSVG from "../../images/icons/success.svg";


const AlertMessage = (props) => {
  const { message, type } = props
  return (
    <div class="alert-success-message">
      <img src={successSVG} />
      {message}
    </div>
  );
} 



export default AlertMessage;
