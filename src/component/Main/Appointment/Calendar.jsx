import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useGetAppointmentsQuery } from "../../../redux/features/dashboard/dashboardApi";
import moment from "moment";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CustomCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: appointments, isLoading } = useGetAppointmentsQuery(
    selectedDate ? { 
      date: moment(selectedDate).format("YYYY-MM-DD"),
      page: 1,
      limit: 10,
      sortBy: "createdAt:desc"
    } : {}
  );

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generate calendar days with proper padding
  const calendarDays = [];
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const appointmentsByDate = {};
  appointments?.results?.forEach(appt => {
    const date = moment(appt.date).format("YYYY-MM-DD");
    if (!appointmentsByDate[date]) {
      appointmentsByDate[date] = [];
    }
    appointmentsByDate[date].push(appt);
  });

  const handleDateClick = (day) => {
    if (day !== null) {
      const clickedDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(clickedDate);
    }
  };

  const getAppointmentCountForDay = (day) => {
    if (day === null) return 0;
    const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return appointmentsByDate[dateStr]?.length || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-200';
      case 'pending': return 'bg-yellow-200';
      case 'cancelled': return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Calendar Header */}
      <div className="flex justify-between items-center w-full mb-6 border-b-2 pb-2">
        <button 
          onClick={prevMonth} 
          className="text-gray-700 py-2 px-3 rounded flex items-center transition duration-300"
        >
          <FaArrowLeft className="size-5" />
        </button>
        
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-700">{months[currentMonth]}</h2>
          <span className="text-gray-600 pt-1 pl-2">{currentYear}</span>
        </div>
        
        <button 
          onClick={nextMonth} 
          className="text-gray-700 py-2 px-3 rounded flex items-center transition duration-300"
        >
          <MdKeyboardArrowRight className="size-5" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 w-full mb-2 text-gray-500 font-semibold text-sm">
        {daysOfWeek.map((dayName) => (
          <div key={dayName} className="text-center py-1">{dayName}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 w-full">
        {calendarDays.map((day, index) => {
          const hasAppointments = day !== null && getAppointmentCountForDay(day) > 0;
          const isSelected = selectedDate && 
                            selectedDate.getDate() === day && 
                            selectedDate.getMonth() === currentMonth && 
                            selectedDate.getFullYear() === currentYear;
          const isToday = day === new Date().getDate() && 
                         currentMonth === new Date().getMonth() && 
                         currentYear === new Date().getFullYear();

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`relative flex flex-col items-center justify-start px-5 py-[3.25rem]  border rounded
                ${day === null ? 'border-transparent' : 'border-gray-100'}
                ${isSelected ? 'border-2 border-blue-500 bg-blue-50' : ''} 
                ${hasAppointments ? 'bg-[#92D0FE]' : ''}
                ${isToday ? 'bg-blue-100' : ''}
                ${day !== null ? 'hover:bg-gray-50 cursor-pointer' : ''}
              `}
            >
              {day !== null && (
                <>
                  <span className={`text-sm font-medium 
                    ${isSelected ? 'text-blue-700 font-bold' : ''}
                    ${isToday ? 'text-blue-800 font-bold' : 'text-gray-700'}
                  `}>
                    {day}
                  </span>
                  {hasAppointments && (
                    <div className="absolute bottom-1 flex justify-center">
                      <div className="bg-[#92D0FE] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {getAppointmentCountForDay(day)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Appointment details for selected date */}
      {selectedDate && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">
            Appointments for {moment(selectedDate).format("MMMM D, YYYY")}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({getAppointmentCountForDay(selectedDate.getDate())} appointments)
            </span>
          </h3>
          {isLoading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : appointmentsByDate[moment(selectedDate).format("YYYY-MM-DD")]?.length > 0 ? (
            <div className="space-y-3">
              {appointmentsByDate[moment(selectedDate).format("YYYY-MM-DD")].map((appt) => (
                <div 
                  key={appt._id}
                  className={`p-4 rounded-lg ${getStatusColor(appt.status)}`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`${appt.booker?.profileImage ? imageBaseUrl + appt.booker.profileImage : 'https://randomuser.me/api/portraits/men/1.jpg'}`}
                      alt={appt.patientName}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{appt.patientName}</span>
                        <span className="text-sm">{appt.timeSlot}</span>
                      </div>
                      <div className="text-sm text-gray-600">{appt.visitType}</div>
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No appointments for this date</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;