/* eslint-disable react/prop-types */

import { DatePicker } from "antd";
const CustomDatePicker= ({
  placeholder,
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <DatePicker
      size="large"
      disabled={disabled}
      placeholder={placeholder || "Select date"}
      className={`w-full border border-[#77C4FE] px-4 py-2 text-[16px] bg-primary text-gray-700 rounded-lg focus:border-[#77C4FE] ${className}`}
      {...rest} // Additional props
    />
  );
};

export default CustomDatePicker;
