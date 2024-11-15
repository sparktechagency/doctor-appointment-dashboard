/* eslint-disable react/prop-types */

import { Select } from "antd";

const CustomSelect = ({
  placeholder,
  className = "",
  options = [],
  ...rest
}) => {
  return (
    <div className="relative">
      <Select
        size="large"
        style={{
          padding: "20px",
        }}
        placeholder={placeholder || "Select value"}
        className={`w-full border border-[#77C4FE] px-4 py-2 text-[16px] bg-[#D5EDFF] text-gray-700 rounded-lg focus:border-[#77C4FE] ${className}`}
        {...rest}
      >
        {options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default CustomSelect;
