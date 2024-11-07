import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CustomCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generate an array with empty days for padding the first week
  const calendarDays = Array.from({ length: firstDayOfMonth }).fill(null).concat(days);

  return (
    <div className="p-6 w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center w-full mb-6">
        <button onClick={prevMonth} className="bg-[#77C4FE] text-white py-2 px-3 rounded flex items-center transition duration-300">
          <FaArrowLeft className="mr-2" /> 
        </button>
        <h2 className="text-2xl font-bold text-gray-700">{`${months[currentMonth]}`}</h2>
        <button onClick={nextMonth} className="bg-[#77C4FE] text-white py-2 px-3 rounded flex items-center transition duration-300">
          <FaArrowRight className="ml-2" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 w-full mb-4 text-gray-600 font-semibold">
        {daysOfWeek.map((dayName) => (
          <div key={dayName} className="text-center">{dayName}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 w-full">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`flex items-center justify-center border border-gray-100 p-4
              ${index >= 18 && index <= 22 && index!== 19 && index!== 21? "bg-blue-300" : ""}
               ${index === 19 || index === 20 || index === 21 ? "bg-green-200" : ""}
              ${index % 7 === 0 ? "bg-red-100" : index % 7 === 6 ? "bg-blue-100" : "bg-white"}
              ${index >= 18 && index <= 22 && index !== 19 && index !== 21 ? "bg-blue-300" : ""}}
            `}
          >
            {day !== null ? (
              <span className="text-gray-700 font-medium">{day}</span>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
