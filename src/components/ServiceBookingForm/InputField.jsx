import React from "react";

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      }`}
    />
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export default InputField;
