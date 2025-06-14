import { IoChevronBack } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { logoutUser } from "../../../redux/features/auth/authSlice";
import { useUpdateUserMutation } from "../../../redux/features/auth/authApi";
import { useState, useRef } from "react";
import { message } from "antd";

const EditPersonalInfo = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const fileInputRef = useRef(null);

  // Initialize form state with all user data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    callingCode: user?.callingCode || "+880",
    userName: user?.userName || "",
    height: {
      value: user?.height?.value || "",
      unit: user?.height?.unit || "cm"
    },
    weight: {
      value: user?.weight?.value || "",
      unit: user?.weight?.unit || "kg"
    },
    dateOfBirth: user?.dateOfBirth || "",
    medicalCondition: user?.medicalCondition || []
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    user?.profileImage 
      ? `${imageBaseUrl}${user.profileImage}`
      : `${imageBaseUrl}/uploads/default-profile.png`
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parentField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Append all regular fields
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('callingCode', formData.callingCode);
      formDataToSend.append('userName', formData.userName);
      formDataToSend.append('height[value]', formData.height.value);
      formDataToSend.append('height[unit]', formData.height.unit);
      formDataToSend.append('weight[value]', formData.weight.value);
      formDataToSend.append('weight[unit]', formData.weight.unit);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formData.medicalCondition.forEach(condition => {
        formDataToSend.append('medicalCondition[]', condition);
      });

      // Append profile image if changed
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await updateUser(formDataToSend).unwrap();
      
      message.success(response.message || "Profile updated successfully");
      navigate('/about');
    } catch (error) {
      message.error(error.data?.message || "Failed to update profile");
    }
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
            <div className="relative w-[130px] h-[130px] rounded-full bg-[#D9D9D9]">
              <img
                className="size-32 rounded-full mx-auto object-cover"
                src={previewImage}
                alt="Profile"
              />
              <button
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-[#77C4FE] text-white rounded-full p-2 hover:bg-[#5aa8e5] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <span className="mt-2 text-gray-500">Profile</span>
            <span className="text-lg font-semibold uppercase">
              {user?.role}
            </span>
          </div>
          <div className="float-end flex gap-4">
            <button 
              onClick={handleLogout}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Personal Details */}
        <form onSubmit={handleSubmit} className="full space-y-6 mt-6">
          {/* Basic Information */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
              disabled
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>
          
          {/* Contact Information */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Phone Number</label>
            <div className="flex gap-2">
              <select
                name="callingCode"
                value={formData.callingCode}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-3 bg-white outline-none"
              >
                <option value="+880">+880 (BD)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
              </select>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
            />
          </div>

          {/* Health Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Height</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.height.value}
                  onChange={(e) => handleNestedChange('height', 'value', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
                  placeholder="Value"
                />
                <select
                  value={formData.height.unit}
                  onChange={(e) => handleNestedChange('height', 'unit', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 bg-white outline-none"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold">Weight</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.weight.value}
                  onChange={(e) => handleNestedChange('weight', 'value', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
                  placeholder="Value"
                />
                <select
                  value={formData.weight.unit}
                  onChange={(e) => handleNestedChange('weight', 'unit', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 bg-white outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold">Medical Conditions</label>
            <input
              type="text"
              value={formData.medicalCondition.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                medicalCondition: e.target.value.split(',').map(item => item.trim())
              })}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 bg-white outline-none"
              placeholder="Comma separated conditions"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 bg-[#77C4FE] text-white rounded-lg w-full hover:bg-[#5aa8e5] transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPersonalInfo;