import { useGetAppointmentsQuery } from "../../../redux/features/dashboard/dashboardApi"; 
import moment from "moment";

const DayAppointment = () => {
  // Get today's date in YYYY-MM-DD format
  const today = moment().format("YYYY-MM-DD");
  
  // Fetch appointments for today using RTK Query
  const { data: appointments, isLoading } = useGetAppointmentsQuery({
    date: today,
    sortBy: "createdAt:desc"
  });

  // Transform the API data to match the component's structure
  const todayAppointments = appointments?.results?.map(appointment => ({
    _id: appointment._id,
    image: appointment.booker?.profileImage || "https://randomuser.me/api/portraits/men/1.jpg",
    name: appointment.patientName,
    email: appointment.patientEmail,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    status: appointment.status
  })) || [];

  return (
    <div>
      <h1 className="text-xl py-5">Today's Appointments</h1>
      {isLoading ? (
        <div className="py-6 space-y-2 bg-[#D5EDFF] rounded-md">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white shadow-md overflow-hidden md:flex py-2 px-4 space-x-5 border-b hover:bg-gray-50 animate-pulse">
              <div className="flex-shrink-0">
                <div className="w-[40px] h-[40px] rounded-full bg-gray-200"></div>
              </div>
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : todayAppointments.length > 0 ? (
        <div className="py-6 space-y-2 bg-[#D5EDFF] rounded-md">
          {todayAppointments.map((item, index) => {
            // Format the date to show time only (since we're showing today's appointments)
            const formattedTime = moment(item.date).format("h:mm A");
            
            return (
              <div
                key={item._id || index}
                className="bg-white shadow-md overflow-hidden md:flex py-2 px-4 space-x-5 border-b hover:bg-gray-50"
              >
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
                    }}
                  />
                </div>

                {/* Name and Email */}
                <div className="flex-grow md:flex space-x-2 justify-around">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">{item.email}</p>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 flex items-center">
                  <p className="text-gray-500 text-sm">
                    {formattedTime} ({item.timeSlot})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 bg-[#D5EDFF] rounded-md text-center">
          <p className="text-gray-500">No appointments for today</p>
        </div>
      )}
    </div>
  );
};

export default DayAppointment;