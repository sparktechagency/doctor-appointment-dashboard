/* eslint-disable react/prop-types */
import { Input } from "antd";

const CustomInput = ({ icon: Icon, label, placeholder, className, type = "text", isPassword = false, ...rest }) => {
  return (
    <div className="w-full">
      {/* Dynamic Label */}
      {label && <label className="block mb-2 text-gray-700 text-sm font-medium">{label}</label>}
      
      <div className="relative ">
        {/* Use Input.Password if isPassword is true */}
        {isPassword ? (
          <Input.Password
            prefix={Icon && <Icon className="text-gray-500 text-xl " />} // Dynamic icon
            placeholder={placeholder || "Enter password"} // Dynamic placeholder
            className={`w-full px-4 py-2 text-[16px]  text-gray-700 rounded-lg  bg-[#D5EDFF] border-none ${className}`}
            {...rest} // Additional props
          />
        ) : (
          <Input
            prefix={Icon && <Icon className="text-gray-500 text-xl " />} // Dynamic icon
            placeholder={placeholder || "Enter value"} // Dynamic placeholder
            className={`w-full px-4 py-2 text-[16px]  text-gray-700 rounded-lg bg-[#D5EDFF] border-none ${className}`}
            type={type} // Default input type
            {...rest} // Additional props
          />
        )}
      </div>
    </div>
  );
};

export default CustomInput;