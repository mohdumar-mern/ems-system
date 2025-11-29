import React from "react";
import "./SelectField.scss";

const SelectField = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  options = [],
  placeholder = "Select an option",
}) => {
  return (
    <div className="select-group">
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label htmlFor={id || name} className="select-label">{label}</label>
    </div>
  );
};

export default SelectField;
