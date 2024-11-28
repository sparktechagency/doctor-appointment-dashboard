import { Form } from "antd";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";

const AppointmentSection = () => {
  return (
    <div>
      <section className="px-2 mt-5">
        <div className=" rounded-lg ">
          <div className="flex justify-between items-center  py-5">
            <h1 className="text-xl font-semibold flex items-center ">
              <MdKeyboardArrowLeft /> Appointment
            </h1>
            <Form layout="inline" className="flex space-x-4">
              <button className=" flex justify-center items-center bg-secondary text-white px-3 py-2 rounded-md">
                <FaArrowRightArrowLeft className="size-5" />
                <p className="px-2">Today’s Apt</p>
              </button>
              <Link to="/appointmentlist">
                <button className="flex justify-center items-center bg-secondary text-white px-3 py-2 rounded-md">
                  <FaArrowRightArrowLeft className="size-5" />
                  <p className="px-2">All Apt</p>
                </button>
              </Link>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentSection;
