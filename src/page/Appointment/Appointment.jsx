import AppointmentSection from "../../component/Main/Appointment/Appointment";
import CustomCalendar from "../../component/Main/Appointment/Calendar";
import DayAppointment from "../../component/Main/Appointment/DayAppointment";

const Appointment = () => {
  return (
    <div>
      <AppointmentSection />
      <div className="md:flex justify-between ">
        <div className="w-2/3">
          <CustomCalendar />
        </div>
        <div className="w-1/3">
          <DayAppointment />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
