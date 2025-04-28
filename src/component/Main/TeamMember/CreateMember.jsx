import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner"; // for showing success/error messages
import { useCreateMemberMutation } from "../../../redux/features/teams/teamsApi";

const CreateMember = () => {
  const [createMember] = useCreateMemberMutation(); // Assuming a mutation hook for team creation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // fullName: "",
    designation: "",
    specialties: "",
    about: "",
    phone: "",
    email: "",
    profileImage: "",
    media: {
      facebook: "",
      instagram: "",
      linkedin: "",
      x: "",
    },
    degrees: "", // New field
    experience: "", // New field
    achievements: "", // New field
  });

  const navigate = useNavigate();

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.media) {
      setFormData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure degrees, experience, achievements are in the correct format
    const updatedFormData = {
      ...formData,
      degrees: formData.degrees ? [formData.degrees] : [],  // Converting to array if it's a single string
      experience: formData.experience ? [formData.experience] : [],
      achievements: formData.achievements ? [formData.achievements] : [],
    };
  
    try {
      const res = await createMember(updatedFormData);
      if (res.error) {
        toast.error("Failed to add member");
      } else {
        toast.success("Member added successfully");
        navigate("/teammember"); // Redirect after successful member creation
      }
    } catch (error) {
      toast.error("Something went wrong while adding the member");
    }
  };

  // Handle file upload change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    // Assuming that the profile image will be uploaded to a server and its URL is returned
    if (name === "profileImage" && files.length > 0) {
      // Replace this with actual logic to upload the file and get a URL
      setFormData((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]), // Just for testing, replace with actual file upload logic
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
      <form onSubmit={handleSubmit}>
        {/* first name */}
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* last name */}
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* full name
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div> */}
        {/* designation */}
        <div className="mb-4">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* specialties */}
        <div className="mb-4">
          <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">Specialties</label>
          <input
            type="text"
            id="specialties"
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* about */}
        <div className="mb-4">
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* Profile Image Upload */}
        <div className="mb-4">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {/* Social Media Links */}
        <div className="mb-4">
          <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook URL</label>
          <input
            type="url"
            id="facebook"
            name="facebook"
            value={formData.media.facebook}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram URL</label>
          <input
            type="url"
            id="instagram"
            name="instagram"
            value={formData.media.instagram}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.media.linkedin}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="x" className="block text-sm font-medium text-gray-700">X URL</label>
          <input
            type="url"
            id="x"
            name="x"
            value={formData.media.x}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="px-8 py-3 text-white bg-primary rounded"
          >
            Add Member
          </button>
          <Link to="/teammember">
            <button
              type="button"
              className="px-8 py-3 text-white bg-gray-400 rounded"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateMember;
