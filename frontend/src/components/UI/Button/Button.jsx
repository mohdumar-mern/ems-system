import React from "react";

import './Button.scss'

const Button = ({ type = "", className = "", title= "", disabled, text, size='18', onClick = () => {}, Icon = () => null }) => {
  return (
    <button 
      onClick={onClick}
      type={type}
      title={title}
      aria-label={title}
      className={`login-button ${className}`}
      disabled={disabled}
    >
      <Icon size={size} />  {text}{" "}
    </button>
  );
};

export default Button;
