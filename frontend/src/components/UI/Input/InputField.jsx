import React from "react";
import "./InputField.scss";

const InputField = ({
  label,
  type = "text",
  id,
  name,
  placeholder = " ",
  value,
  onChange,
  autoComplete,
  required = false,
  rows = 4,
}) => {
  return (
    <div className="input-group">
      {type === "textarea" ? (
        <textarea
          id={id || name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          id={id || name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
        />
      )}
      <label htmlFor={id || name}>{label}</label>
    </div>
  );
};

export default InputField;
