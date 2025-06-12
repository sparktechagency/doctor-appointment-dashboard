import { IoChevronBack } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { logoutUser } from "../../../redux/features/auth/authSlice"; // Import your logout action

const PersonalInformation = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logout action
    navigate('/auth'); // Redirect to login page
  };

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
      </div>

      {/* Profile Information */}
      <div className="w-3/4 mx-auto">
        {/* Profile Picture */}
        <div className="flex justify-between items-center gap-5">
          <div className="flex justify-around items-center gap-10">
            <div className="w-[130px] h-[130px] rounded-full bg-[#D9D9D9]">
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
          <div className="float-end flex gap-4">
            <Link to="/edit-personal-info">
              <button className="px-8 py-3 bg-[#77C4FE] text-white rounded-lg">
                Edit Profile
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Personal Details */}
        <form className="full space-y-6 mt-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Full name</label>
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
            <label className="block text-sm font-semibold">Address</label>
            <input
              type="text"
              defaultValue={user?.Address}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Contact number</label>
            <input
              type="text"
              defaultValue={user?.phoneNumber}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <button className="px-8 py-3 bg-[#77C4FE] text-white rounded-lg w-full">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;