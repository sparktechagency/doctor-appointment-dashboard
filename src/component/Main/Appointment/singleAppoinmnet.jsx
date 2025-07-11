import { useParams, useNavigate } from "react-router-dom";
import { useGetAppointmentByIdQuery } from "../../../redux/features/dashboard/dashboardApi";
import { FaArrowLeft } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import moment from "moment";

const AppointmentSingleSection = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  // Fetch appointment data using RTK Query
  const { data: appointmentData, isLoading, isError } = useGetAppointmentByIdQuery(appointmentId);
  
  const selectedAppointment = appointmentData?.attributes
 || {};
 console.log(selectedAppointment)
  console.log(selectedAppointment)
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Appointments", link: "/appointments" },
    { title: "Appointment Details", link: "" },
  ];

  const handleBackToList = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error loading appointment details</div>
      </div>
    );
  }

  return (
    <div>
    <section className="px-2 mt-5">
      <div className="rounded-lg">
        <div className="justify-center items-center px-5 py-5 max-w-6xl">
            
            <div className="flex items-center mb-6 cursor-pointer" onClick={handleBackToList}>
              <MdKeyboardArrowLeft className="text-2xl mr-2" />
              <span className="text-lg font-medium">Back to Appointments</span>
            </div>
            
            <h2 className="flex justify-center items-center text-3xl font-semibold text-gray-800 text-center mt-8 mb-10">
              Appointment Details <div><Link to={`/message/${selectedAppointment.id}`}><svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" rx="24" fill="#F1F9FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M32 23C32 20.1911 32 18.7866 31.3259 17.7777C31.034 17.341 30.659 16.966 30.2223 16.6741C29.2134 16 27.8089 16 25 16H23C20.1911 16 18.7866 16 17.7777 16.6741C17.341 16.966 16.966 17.341 16.6741 17.7777C16 18.7866 16 20.1911 16 23C16 25.8089 16 27.2134 16.6741 28.2223C16.966 28.659 17.341 29.034 17.7777 29.3259C18.6591 29.9148 19.8423 29.9892 22 29.9986V30L23.1056 32.2111C23.4741 32.9482 24.5259 32.9482 24.8944 32.2111L26 30V29.9986C28.1577 29.9892 29.3409 29.9148 30.2223 29.3259C30.659 29.034 31.034 28.659 31.3259 28.2223C32 27.2134 32 25.8089 32 23ZM25 25C25 24.4477 24.5523 24 24 24H21C20.4477 24 20 24.4477 20 25C20 25.5523 20.4477 26 21 26H24C24.5523 26 25 25.5523 25 25ZM28 21C28 20.4477 27.5523 20 27 20H21C20.4477 20 20 20.4477 20 21C20 21.5523 20.4477 22 21 22H27C27.5523 22 28 21.5523 28 21Z" fill="#77C4FE"/>
</svg>
</Link> </div>
            </h2>
             
            <div className="bg-transparent rounded-lg border border-[#77C4FE] p-10 shadow-sm mb-6">
              <div className="border-b border-[#77C4FE] pb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Appointment ID:</span>
                <span className="text-gray-900 md:col-span-3">{selectedAppointment.appointmentId}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Patient Name:</span>
                <span className="text-gray-900">{selectedAppointment.patientName}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Patient Email:</span>
                <span className="text-gray-900">{selectedAppointment.patientEmail}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Phone Number:</span>
                <span className="text-gray-900">{selectedAppointment.patientPhone}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Patient Age:</span>
                <span className="text-gray-900">{selectedAppointment.patientAge}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Patient Gender:</span>
                <span className="text-gray-900 capitalize">{selectedAppointment.patientGender}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="text-gray-900">{selectedAppointment.patientAddress}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Reason for Visit:</span>
                <span className="text-gray-900">{selectedAppointment.visitType}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Department:</span>
                <span className="text-gray-900">{selectedAppointment.category}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Body Part:</span>
                <span className="text-gray-900">{selectedAppointment.bodyPart}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Preferred Time:</span>
                <span className="text-gray-900">{selectedAppointment.timeSlot}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Preferred Date:</span>
                <span className="text-gray-900">
                  {moment(selectedAppointment.date).format("MMMM D, YYYY")}
                </span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="text-gray-900 capitalize">{selectedAppointment.status}</span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Payment Method:</span>
                <span className="text-gray-900 capitalize">
                  {selectedAppointment.paymentDetails?.method || "Not specified"}
                </span>
              </div>
              
              <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <span className="font-medium text-gray-700">Payment Status:</span>
                <span className="text-gray-900 capitalize">
                  {selectedAppointment.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
              
              {selectedAppointment.reason && (
                <div className="border-b border-[#77C4FE] py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <span className="font-medium text-gray-700">Additional Reason:</span>
                  <span className="text-gray-900 md:col-span-3">{selectedAppointment.reason}</span>
                </div>
              )}
              
              {selectedAppointment.specificConditions && (
                <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <span className="font-medium text-gray-700">Specific Conditions:</span>
                  <span className="text-gray-900 md:col-span-3">{selectedAppointment.specificConditions}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleBackToList}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Back to Appointments
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentSingleSection;