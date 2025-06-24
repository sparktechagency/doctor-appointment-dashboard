import { IoChevronBack } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { logoutUser } from "../../../redux/features/auth/authSlice";
import { useGetUserQuery, useLogoutMutation } from "../../../redux/features/auth/authApi"; // Import the hooks

const PersonalInformation = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const { data: userData, isLoading, isError } = useGetUserQuery();

  // Use userData from the query if available, otherwise fall back to Redux user
  const currentUser = userData?.data?.attributes?.user || user;

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutUser());
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;

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
                src={`${imageBaseUrl}${currentUser?.profileImage}`}
                alt=""
              />
            </div>
            <span className="mt-2 text-gray-500">Profile</span>
            <span className="text-lg font-semibold uppercase">
              {currentUser?.role}
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
              defaultValue={currentUser?.fullName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              defaultValue={currentUser?.email}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Address</label>
            <input
              type="text"
              defaultValue={currentUser?.address}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Contact number</label>
            <input
              type="text"
              defaultValue={`${currentUser?.callingCode} ${currentUser?.phoneNumber}`}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          <button type="button" className="px-8 py-3 bg-[#77C4FE] text-white rounded-lg w-full">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;