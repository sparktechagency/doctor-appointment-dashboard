import { Form } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import CustomInput from "../../../utils/CustomInput";
import { useGetAllTeamsArrayQuery, useUpdateMemberMutation } from "../../../redux/features/teams/teamsApi";

const EditMembers = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Fetching all members data
  const { data: allItems = [], refetch } = useGetAllTeamsArrayQuery();
  const [updateMember, { isLoading }] = useUpdateMemberMutation();
  const member = allItems.find((item) => item.id === id);
console.log(member)
  // Prefill form when member is found
  if (member && !form.getFieldValue("firstName")) {
    form.setFieldsValue({
      firstName: member.firstName,
      lastName: member.lastName,
      designation: member.designation,
      specialties: member.specialties,
      about: member.about,
      phone: member.phone,
      email: member.email,
      profileImage: member.profileImage,
      media: {
        facebook: member.media.facebook,
        instagram: member.media.instagram,
        linkedin: member.media.linkedin,
        x: member.media.x,
      },
      degrees: member.degrees?.join(", "),  // Convert array back to string
      experience: member.experience?.join(", "),
      achievements: member.achievements?.join(", "),
    });
  }

  const onFinish = async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      designation: values.designation,
      specialties: values.specialties,
      about: values.about,
      phone: values.phone,
      email: values.email,
      profileImage: values.profileImage,
      media: values.media,
      degrees: values.degrees?.split(",").map((item) => item.trim()),
      experience: values.experience?.split(",").map((item) => item.trim()),
      achievements: values.achievements?.split(",").map((item) => item.trim()),
    };
  
    try {
      const response = await updateMember({ id, payload }); // Pass both id and payload
      if (response.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        form.resetFields();
        await refetch();
        navigate("/teammember");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Something went wrong");
    }
  };
  

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 items-center my-6">
        <Link to="/teammember">
          <IoChevronBack className="size-6" />
        </Link>
        <h1 className="text-2xl font-semibold">Edit Member</h1>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-5">
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please enter first name!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="First Name"
          />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please enter last name!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Last Name"
          />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: "Please enter designation!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Designation"
          />
        </Form.Item>

        <Form.Item
          label="Specialties"
          name="specialties"
          rules={[{ required: true, message: "Please enter specialties!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Specialties"
          />
        </Form.Item>

        <Form.Item
          label="About"
          name="about"
          rules={[{ required: true, message: "Please enter about!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="About"
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter phone number!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Phone"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter email!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          label="Profile Image"
          name="profileImage"
          className="w-[90%]"
        >
          <CustomInput
            type="file"
            className="bg-white border-secondary"
            placeholder="Upload Profile Image"
          />
        </Form.Item>

        {/* Social Media Links */}
        <Form.Item label="Facebook URL" name="media.facebook" className="w-[90%]">
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Facebook URL"
          />
        </Form.Item>

        <Form.Item label="Instagram URL" name="media.instagram" className="w-[90%]">
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Instagram URL"
          />
        </Form.Item>

        <Form.Item label="LinkedIn URL" name="media.linkedin" className="w-[90%]">
          <CustomInput
            className="bg-white border-secondary"
            placeholder="LinkedIn URL"
          />
        </Form.Item>

        <Form.Item label="X URL" name="media.x" className="w-[90%]">
          <CustomInput
            className="bg-white border-secondary"
            placeholder="X URL"
          />
        </Form.Item>

        <Form.Item label="Degrees" name="degrees" className="w-[90%]">
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Degrees (comma-separated)"
          />
        </Form.Item>

        <Form.Item label="Experience" name="experience" className="w-[90%]">
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Experience (comma-separated)"
          />
        </Form.Item>

        <Form.Item label="Achievements" name="achievements" className="w-[90%]">
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Achievements (comma-separated)"
          />
        </Form.Item>

        <button
          type="submit"
          disabled={isLoading}
          className="w-[90%] mt-5 bg-primary px-5 py-2 flex justify-center items-center gap-5 text-white rounded-md border-none"
        >
          {isLoading ? "Updating..." : "Update Member"}
        </button>
      </Form>
    </div>
  );
};

export default EditMembers;
