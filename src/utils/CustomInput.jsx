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
          className={`w-full border border-primary px-4 py-2 text-[16px] bg-primary text-gray-700 rounded-lg focus:border-primary ${className}`}
          {...rest} // Spread TextAreaProps if isTextArea
        />
      ) : isPassword ? (
        <Input.Password
          prefix={Icon && <Icon className="text-gray-500 text-xl" />} // Dynamic icon
          placeholder={placeholder || "Enter password"} // Dynamic placeholder
          className={`w-full border border-primary px-4 py-2 text-[16px] bg-primary text-gray-700 rounded-lg focus:border-primary ${className}`}
          {...rest} // Spread InputProps if isPassword
        />
      ) : (
        <Input
          prefix={Icon && <Icon className="text-gray-500 text-xl" />} // Dynamic icon
          placeholder={placeholder || "Enter value"} // Dynamic placeholder
          className={`w-full border border-primary px-4 py-2 text-[16px] bg-primary text-gray-700 rounded-lg focus:border-primary ${className}`} // Apply focus color
          type={type} // Default input type
          {...rest} // Spread InputProps for regular input
        />
      )}
    </div>
  );
};

export default CustomInput;
