import TextArea from "antd/es/input/TextArea";
import { IoChevronBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const AddInformation = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full px-4 py-6">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/about">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Add Information</h1>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row justify-start items-center gap-5 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10 w-full">
            <div className="w-32 h-32 rounded-full bg-[#D9D9D9] overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={`${imageBaseUrl}${user?.image?.url}`}
                alt="Profile"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button className="px-6 py-2 sm:px-8 sm:py-3 bg-[#77C4FE] text-white rounded-lg whitespace-nowrap">
                Upload Photo
              </button>
              <span className="text-lg font-semibold uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <form className="w-full space-y-6">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-semibold mb-2">First Name</label>
              <input
                type="text"
                defaultValue={user?.firstName}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#D5EDFF] outline-none"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-semibold mb-2">Last Name</label>
              <input
                type="text"
                defaultValue={user?.lastName}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#D5EDFF] outline-none"
              />
            </div>
          </div>
          
          <div className="w-full">
            <label className="block text-sm font-semibold mb-2">Degree</label>
            <input
              type="email"
              defaultValue={user?.degree}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#D5EDFF] outline-none"
            />
          </div>
          
          <div className="w-full">
            <label className="block text-sm font-semibold mb-2">Experiences</label>
            <input
              type="text"
              defaultValue={user?.experiences}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#D5EDFF] outline-none"
            />
          </div>
          
          <div className="w-full">
            <label className="block text-sm font-semibold mb-2">Awards/Achievements</label>
            <input
              type="text"
              defaultValue={user?.awards}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#D5EDFF] outline-none"
            />
          </div>
          
          <div className="w-full">
            <label className="block text-sm font-semibold mb-2">About Me</label>
            <TextArea
              defaultValue={user?.bio}
              autoSize={{ minRows: 5 }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#D5EDFF] outline-none"
            />
          </div>
           
          <div className="flex justify-end mt-8">
            <Link to="/editInformation">
              <button className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition">
                Edit Profile
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInformation;