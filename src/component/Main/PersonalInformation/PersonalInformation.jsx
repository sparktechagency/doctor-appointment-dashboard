import { IoChevronBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";


const PersonalInformation = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center my-6">
          <Link to="/">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Personal Information</h1>
        </div>
        <Link to="/edit-personal-info">
          <button className="px-8 py-3 bg-primary text-white rounded-lg">
            Edit Profile
          </button>
        </Link>
      </div>

      {/* Profile Information */}
      <div className="w-3/4 mx-auto">
        {/* Profile Picture */}
        <div className="flex justify-start items-center  gap-5">
          <div className="flex justify-around items-center gap-10">
          <div className="w-[130px] h-[130px] rounded-full bg-[#D5EDFF]">
            <img
              className="size-32 rounded-full mx-auto"
              src={`${imageBaseUrl}${user?.image?.url}`}
              alt=""
            />
            </div>
            <span className="mt-2 text-gray-500">Profile</span>
            <span className="text-lg font-semibold uppercase">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Personal Details */}
        <form className="full  space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Name</label>
            <input
              type="text"
              defaultValue={user?.fullName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Phone Number</label>
            <input
              type="text"
              defaultValue={user?.phone}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Address</label>
            <input
              type="text"
              defaultValue={user?.Address}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <button className="px-8 py-3 bg-primary text-white rounded-lg w-full">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
