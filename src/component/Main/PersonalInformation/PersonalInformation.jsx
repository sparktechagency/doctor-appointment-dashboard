import { IoChevronBack } from "react-icons/io5";
import {  useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { logoutUser } from "../../../redux/features/auth/authSlice";
import { BASE_URL } from "../../../utils/constants";
import { useGetUserQuery } from "../../../redux/features/auth/authApi";
const PersonalInformation = () => {
    const [user, { isLoading }] = useGetUserQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth');
  };

  const imageUrl = user?.profileImage
    ? `${BASE_URL}${user.profileImage}`
    : `${BASE_URL}/uploads/default-profile.png`;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format subscription status
  const formatSubscription = (subscription) => {
    if (!subscription) return "No subscription";
    return `${subscription.status} (${subscription.isSubscriptionTaken ? "Active" : "Inactive"})`;
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
                className="size-32 rounded-full mx-auto object-cover"
                src={imageUrl}
                alt="Profile"
                onError={(e) => {
                  e.target.src = `${BASE_URL}/uploads/default-profile.png`;
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="mt-2 text-gray-500">Profile</span>
              <span className="text-lg font-semibold uppercase">
                {user?.role}
              </span>
              <span className="text-sm text-gray-500">
                Joined: {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
          <div className="float-end flex gap-4">
            <Link to="/edit-personal-info">
              <button className="px-8 py-3 bg-[#77C4FE] text-white rounded-lg hover:bg-[#5aa8e5] transition-colors">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500">Full Name</label>
                <p className="mt-1">{user?.fullName || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">First Name</label>
                <p className="mt-1">{user?.firstName || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Last Name</label>
                <p className="mt-1">{user?.lastName || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Username</label>
                <p className="mt-1">{user?.userName || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Date of Birth</label>
                <p className="mt-1">{formatDate(user?.dateOfBirth)}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500">Email</label>
                <p className="mt-1">{user?.email || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Phone Number</label>
                <p className="mt-1">{user?.callingCode} {user?.phoneNumber || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Address</label>
                <p className="mt-1">{user?.address || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Health Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500">Height</label>
                <p className="mt-1">
                  {user?.height?.value ? `${user.height.value} ${user.height.unit}` : "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Weight</label>
                <p className="mt-1">
                  {user?.weight?.value ? `${user.weight.value} ${user.weight.unit}` : "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Medical Conditions</label>
                <p className="mt-1">
                  {user?.medicalCondition?.length > 0 
                    ? user.medicalCondition.join(", ") 
                    : "None specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500">Role</label>
                <p className="mt-1 capitalize">{user?.role?.toLowerCase() || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Subscription</label>
                <p className="mt-1">{formatSubscription(user?.subscription)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Profile Completion</label>
                <p className="mt-1">{user?.isProfileCompleted ? "Completed" : "Incomplete"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Chart Credits</label>
                <p className="mt-1">{user?.chartCredits || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500">Appointment Credits</label>
                <p className="mt-1">{user?.appointmentCredits || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;