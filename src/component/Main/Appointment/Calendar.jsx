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

  // Fetch appointments for the selected date
  const { data: appointments, isLoading } = useGetAppointmentsQuery(
    selectedDate ? { 
      date: moment(selectedDate).format("YYYY-MM-DD"),
      page: 1,
      limit: 10,
      sortBy: "createdAt:desc"
    } : {}
  );

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generate an array with empty days for padding the first week
  const calendarDays = Array.from({ length: firstDayOfMonth }).fill(null).concat(days);

  // Group appointments by date
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
    <div className="p-6 w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-center items-center w-full mb-6 border-b-2">
        <button 
          onClick={prevMonth} 
          className="text-gray-700 py-2 px-3 rounded flex items-center transition duration-300"
        >
          <FaArrowLeft className="size-5" />
        </button>
        <div className="flex flex-cols-2 justify-center items-center mx-auto">
          <h2 className="text-2xl font-bold text-gray-700">{months[currentMonth]}</h2>
          <p className="text-gray-600 pt-1 pl-2">{currentYear}</p>
        </div>
        <button 
          onClick={nextMonth} 
          className="text-gray-700 py-2 px-3 rounded flex items-center transition duration-300"
        >
          <MdKeyboardArrowRight className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 w-full mb-4 text-gray-600 font-semibold text-sm">
        {daysOfWeek.map((dayName) => (
          <div key={dayName} className="text-center">{dayName}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 w-full">
        {calendarDays.map((day, index) => {
          const hasAppointments = day !== null && getAppointmentCountForDay(day) > 0;
          const isSelected = selectedDate && 
                            selectedDate.getDate() === day && 
                            selectedDate.getMonth() === currentMonth && 
                            selectedDate.getFullYear() === currentYear;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`flex flex-col items-center justify-start border border-gray-100 px-4 py-8 pb-[3rem]
                ${isSelected ? 'border-2 border-blue-500' : ''}
                ${hasAppointments ? 'bg-red-300' : ''}
                ${index % 7 === 0 ? 'bg-white-100' : index % 7 === 6 ? 'bg-blue-100' : 'bg-white'}
                hover:bg-gray-50 cursor-pointer
              `}
            >
              {day !== null && (
                <>
                  <span className="text-gray-700 font-medium">{day}</span>
                  {hasAppointments && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
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