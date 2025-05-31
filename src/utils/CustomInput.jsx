/* eslint-disable react/prop-types */
import { Input } from "antd";

const CustomInput = ({
  icon: Icon,
  placeholder,
  className = "",
  type = "text",
  isPassword = false,
  isTextArea = false,
  ...rest
}) => {
  return (
    <div className="w-full relative">
      {/* Render TextArea if isTextArea is true */}
      {isTextArea ? (
        <Input.TextArea
          autoSize={{ minRows: 7, maxRows: 10 }}
          placeholder={placeholder || "Enter text"}
          className={`w-full border border-[#77C4FE] px-4 py-2 text-[16px] bg-[#77C4FE] text-gray-700 rounded-lg focus:border-[#77C4FE] ${className}`}
          {...rest} // Spread TextAreaProps if isTextArea
        />
      ) : isPassword ? (
        <Input.Password
          prefix={Icon && <Icon className="text-gray-500 text-xl" />} // Dynamic icon
          placeholder={placeholder || "Enter password"} // Dynamic placeholder
          className={`w-full border border-[#77C4FE] px-4 py-2 text-[16px] bg-[#77C4FE] text-gray-700 rounded-lg focus:border-[#77C4FE] ${className}`}
          {...rest} // Spread InputProps if isPassword
        />
      ) : (
        <Input
          prefix={Icon && <Icon className="text-gray-500 text-xl" />} // Dynamic icon
          placeholder={placeholder || "Enter value"} // Dynamic placeholder
          className={`w-full border border-[#77C4FE] px-4 py-2 text-[16px] bg-[#77C4FE] text-gray-700 rounded-lg focus:border-[#77C4FE] ${className}`} // Apply focus color
          type={type} // Default input type
          {...rest} // Spread InputProps for regular input
        />
      )}
    </div>
  );
};

export default CustomInput;
