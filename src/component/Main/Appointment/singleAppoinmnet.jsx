import { useParams, useNavigate } from "react-router-dom";
import { useGetAppointmentByIdQuery } from "../../../redux/features/dashboard/dashboardApi";
import { FaArrowLeft } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";

import moment from "moment";

const AppointmentSingleSection = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  // Fetch appointment data using RTK Query
  const { data: appointmentData, isLoading, isError } = useGetAppointmentByIdQuery(appointmentId);
  
  const selectedAppointment = appointmentData.attributes
 || {};
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
      <section className="w-full px-5 py-10 bg-[#F1F9FF] min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-6xl">
         
            
            <div className="flex items-center mb-6 cursor-pointer" onClick={handleBackToList}>
              <MdKeyboardArrowLeft className="text-2xl mr-2" />
              <span className="text-lg font-medium">Back to Appointments</span>
            </div>
            
            <h2 className="text-3xl font-semibold text-gray-800 text-center mt-8 mb-10">
              Appointment Details
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