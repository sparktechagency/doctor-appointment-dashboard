import AppointmentSection from "../../component/Main/Appointment/Appointment";
import CustomCalendar from "../../component/Main/Appointment/Calendar";
import DayAppointment from "../../component/Main/Appointment/DayAppointment";

const Appointment = () => {
  return (
    <div>
      <AppointmentSection />
      <div className="md:flex justify-between ">
        <div className="w-full">
          <CustomCalendar />
        </div>
        <div className="w-full">
          <DayAppointment />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
