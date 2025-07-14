import { Button, Form, Input, Modal, Radio, Select, DatePicker, Upload, message, Checkbox } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { IoChevronBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUpdateTeamMemberMutation, useGetTeamMemberByIdQuery } from "../../../redux/features/product/teamApi";
import { BASE_URL } from "../../../utils/constants";
import moment from "moment";

const { Option } = Select;

const UpdateTeamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: teamMember, isLoading: isTeamMemberLoading } = useGetTeamMemberByIdQuery(id);
  const [updateTeamMember, { isLoading }] = useUpdateTeamMemberMutation();
  const { user } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  const [educationForm] = Form.useForm();
  const [experienceForm] = Form.useForm();
  const [achievementForm] = Form.useForm();

  const [educationItems, setEducationItems] = useState([]);
  const [experienceItems, setExperienceItems] = useState([]);
  const [achievementItems, setAchievementItems] = useState([]);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [isExperienceModalVisible, setIsExperienceModalVisible] = useState(false);
  const [isAchievementModalVisible, setIsAchievementModalVisible] = useState(false);

  const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/128";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `${BASE_URL}${path}`;
  };

  useEffect(() => {
    if (teamMember) {
      const memberData = teamMember.data?.attributes?.team || teamMember;
      let media = {};
      
      try {
        media = typeof memberData.media === 'string' ? JSON.parse(memberData.media) : memberData.media || {};
      } catch (e) {
        console.error('Failed to parse media field', e);
        media = {};
      }

      form.setFieldsValue({
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        designation: memberData.designation,
        specialties: memberData.specialties,
        about: memberData.about,
        callingCode: memberData.callingCode || "+880",
        phoneNumber: memberData.phoneNumber,
        email: memberData.email,
        facebook: media.facebook || '',
        instagram: media.instagram || '',
        linkedin: media.linkedin || '',
        X: media.X || '',
        isAdmin: memberData.isAdmin || false
      });

      setProfileImagePreview(getFullImageUrl(memberData.profileImage));

      setEducationItems(
        memberData.degrees?.map((deg, index) => ({
          id: index + 1,
          institution: deg.school,
          degree: deg.degree,
          field: deg.subject,
          grade: deg.grade,
          startDate: deg.startDate,
          endDate: deg.endDate,
          status: deg.status,
          description: deg.description || "",
          skills: deg.skills || [],
        })) || ['']
      );

      setExperienceItems(
        memberData.experience?.map((exp, index) => ({
          id: index + 1,
          company: exp.company,
          position: exp.title,
          employmentType: exp.employmentType,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          status: exp.status,
          description: exp.description || "",
          skills: exp.skills || [],
        })) || ['']
      );

      setAchievementItems(
        memberData.achievements?.map((ach, index) => ({
          id: index + 1,
          award: ach.title,
          date: ach.date,
          status: ach.status,
          description: ach.description || "",
        })) || ['']
      );
    }
  }, [teamMember, form]);

  const handleImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploading(true);
      setProfileImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
      onSuccess({ url: previewUrl }, file);
      message.success(`${file.name} file selected for upload`);
    } catch (error) {
      onError(error);
      message.error(`${file.name} file upload failed.`);
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      
      // Append all fields individually as FormData
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('fullName', `${values.firstName} ${values.lastName}`);
      formData.append('designation', values.designation);
      formData.append('specialties', values.specialties);
      formData.append('about', values.about);
      formData.append('callingCode', values.callingCode || "+880");
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('email', values.email);
      formData.append('isAdmin', values.isAdmin || false);
      
      // Append media fields
      formData.append('media[facebook]', values.facebook || '');
      formData.append('media[instagram]', values.instagram || '');
      formData.append('media[linkedin]', values.linkedin || '');
      formData.append('media[X]', values.X || '');

      // Append education items
      educationItems.forEach((item, index) => {
        formData.append(`degrees[${index}][school]`, item.institution);
        formData.append(`degrees[${index}][degree]`, item.degree);
        formData.append(`degrees[${index}][subject]`, item.field);
        formData.append(`degrees[${index}][grade]`, item.grade);
        formData.append(`degrees[${index}][startDate]`, item.startDate);
        formData.append(`degrees[${index}][endDate]`, item.endDate || '');
        formData.append(`degrees[${index}][status]`, item.status);
        formData.append(`degrees[${index}][description]`, item.description);
        item.skills.forEach((skill, skillIndex) => {
          formData.append(`degrees[${index}][skills][${skillIndex}]`, skill);
        });
      });

      // Append experience items
      experienceItems.forEach((item, index) => {
        formData.append(`experience[${index}][title]`, item.position);
        formData.append(`experience[${index}][employmentType]`, item.employmentType);
        formData.append(`experience[${index}][company]`, item.company);
        formData.append(`experience[${index}][location]`, item.location);
        formData.append(`experience[${index}][startDate]`, item.startDate);
        formData.append(`experience[${index}][endDate]`, item.endDate || '');
        formData.append(`experience[${index}][status]`, item.status);
        formData.append(`experience[${index}][description]`, item.description);
        item.skills.forEach((skill, skillIndex) => {
          formData.append(`experience[${index}][skills][${skillIndex}]`, skill);
        });
      });

      // Append achievement items
      achievementItems.forEach((item, index) => {
        formData.append(`achievements[${index}][title]`, item.award);
        formData.append(`achievements[${index}][description]`, item.description);
        formData.append(`achievements[${index}][date]`, item.date);
        formData.append(`achievements[${index}][status]`, item.status);
      });

      // Append profile image if a new one was selected
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      const response = await updateTeamMember({ id, data: formData }).unwrap();
      
      if (response?.data || response) {
        message.success("Team member updated successfully!");
        if (profileImageFile) {
          const updatedImage = response.data?.attributes?.team?.profileImage || 
                              response.data?.profileImage || 
                              response.profileImage;
          setProfileImagePreview(getFullImageUrl(updatedImage));
        }
        navigate('/teammember');
      } else {
        message.error(response?.message || "Failed to update team member");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error(error?.message || error?.data?.message || "Failed to update team member");
    }
  };
  // Education form handlers
  const onEducationFinish = (values) => {
    const newId = Math.max(...educationItems.map((item) => item.id), 0) + 1;
    setEducationItems([
      ...educationItems,
      {
        id: newId,
        institution: values.institution,
        degree: values.degree,
        field: values.field,
        grade: values.grade,
        startDate: values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
        endDate: values.endDate ? moment(values.endDate).format("YYYY-MM-DD") : null,
        status: values.status,
        description: values.description,
        skills: values.skills ? values.skills.split(",").map((skill) => skill.trim()) : [],
      },
    ]);
    setIsEducationModalVisible(false);
    educationForm.resetFields();
    message.success("Education added successfully!");
  };

  // Experience form handlers
  const onExperienceFinish = (values) => {
    const newId = Math.max(...experienceItems.map((item) => item.id), 0) + 1;
    setExperienceItems([
      ...experienceItems,
      {
        id: newId,
        company: values.company,
        position: values.position,
        employmentType: values.employmentType,
        location: values.location,
        startDate: values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
        endDate: values.endDate ? moment(values.endDate).format("YYYY-MM-DD") : null,
        status: values.status,
        description: values.description,
        skills: values.skills ? values.skills.split(",").map((skill) => skill.trim()) : [],
      },
    ]);
    setIsExperienceModalVisible(false);
    experienceForm.resetFields();
    message.success("Experience added successfully!");
  };

  // Achievement form handlers
  const onAchievementFinish = (values) => {
    const newId = Math.max(...achievementItems.map((item) => item.id), 0) + 1;
    setAchievementItems([
      ...achievementItems,
      {
        id: newId,
        award: values.award,
        date: values.date ? moment(values.date).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
        status: values.status,
        description: values.description,
      },
    ]);
    setIsAchievementModalVisible(false);
    achievementForm.resetFields();
    message.success("Achievement added successfully!");
  };

  const deleteEducation = (id) => {
    setEducationItems(educationItems.filter((item) => item.id !== id));
    message.success("Education deleted successfully!");
  };

  const deleteExperience = (id) => {
    setExperienceItems(experienceItems.filter((item) => item.id !== id));
    message.success("Experience deleted successfully!");
  };

  const deleteAchievement = (id) => {
    setAchievementItems(achievementItems.filter((item) => item.id !== id));
    message.success("Achievement deleted successfully!");
  };

  const uploadProps = {
    name: "profileImage",
    multiple: false,
    showUploadList: false,
    customRequest: handleImageUpload,
    accept: "image/*",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      return true;
    },
    onChange(info) {
      if (info.file.status === "uploading") {
        setUploading(true);
      } else {
        setUploading(false);
      }
    },
  };

  if (isTeamMemberLoading) {
    return <div className="text-center py-10">Loading team member data...</div>;
  }

  return (
    <div className="w-full px-4 py-6">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/team">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Update Team Member</h1>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-full max-w-4xl mx-auto border border-[#B5B5B5] rounded-2xl">
        <h1 className="p-5 text-2xl font-semibold">Basic Information</h1>
        
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row justify-start items-center gap-5 mb-8 p-4">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10 w-full">
            <div className="w-32 h-32 rounded-full bg-[#D9D9D9] overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={profileImagePreview}
                alt="Profile"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/128";
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Upload {...uploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploading}
                  disabled={uploading} 
                  className="bg-[#77C4FE] text-white py-4"
                >
                  Upload Photo
                </Button>
              </Upload>
            </div>
          </div>
        </div>

        {/* Personal Details Form */}
        <Form form={form} onFinish={onFinish} layout="vertical" className="p-5">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item
              name="firstName"
              label="First Name"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500" />
            </Form.Item>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input phone number!" }]}
            >
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="Enter phone number"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              className="w-full md:w-1/2"
              rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
            >
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="Enter email address"
              />
            </Form.Item>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item
              name="designation"
              label="Designation"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input designation!" }]}
            >
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="Enter designation"
              />
            </Form.Item>
            <Form.Item name="specialties" label="Specialties" className="w-full md:w-1/2">
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="Enter specialties"
              />
            </Form.Item>
          </div>

          <Form.Item name="about" label="About Me">
            <TextArea 
              rows={8} 
              className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
              placeholder="Tell us about yourself..."
            />
          </Form.Item>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item name="facebook" label="Facebook Link" className="w-full md:w-1/2">
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="https://facebook.com/username"
              />
            </Form.Item>
            <Form.Item name="instagram" label="Instagram Link" className="w-full md:w-1/2">
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="https://instagram.com/username"
              />
            </Form.Item>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item name="linkedin" label="LinkedIn Link" className="w-full md:w-1/2">
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="https://linkedin.com/in/username"
              />
            </Form.Item>
            <Form.Item name="X" label="X (Twitter) Link" className="w-full md:w-1/2">
              <Input 
                className="w-full px-3 py-2 bg-[#D5EDFF] border-0 rounded text-xs placeholder-gray-500"
                placeholder="https://twitter.com/username"
              />
            </Form.Item>
          </div>

          {/* Education Section */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Education Information</h1>
                <p className="text-gray-600 mt-1">Your educational background</p>
              </div>
              <Button
                className="bg-[#77C4FE] text-white"
                icon={<PlusOutlined />}
                onClick={() => setIsEducationModalVisible(true)}
              >
                Add Education
              </Button>
            </div>

            {educationItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg mb-4 max-w-md">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-lg font-semibold">{item.institution}</p>
                  <Button
                    onClick={() => deleteEducation(item.id)} 
                    className="bg-[#F45050] text-white"
                    size="small"
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">{item.field}</p>
                  <p className="text-gray-600">{item.degree}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Start Date</p>
                      <p className="text-gray-600 text-sm">{moment(item.startDate).format("DD/MM/YYYY")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">End Date</p>
                      <p className="text-gray-600 text-sm">
                        {item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Grade</p>
                      <p className="text-gray-600 text-sm">{item.grade || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Status</p>
                      <p className="text-gray-600 text-sm">{item.status}</p>
                    </div>
                  </div>
                  <p className="text-blue-600 text-sm">{item.description || "No description"}</p>
                  <p className="text-gray-600 text-sm">Skills: {item.skills.join(", ") || "None"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Experience Information</h1>
                <p className="text-gray-600 mt-1">Your professional experience</p>
              </div>
              <Button
                className="bg-[#77C4FE] text-white"
                icon={<PlusOutlined />}
                onClick={() => setIsExperienceModalVisible(true)}
              >
                Add Experience
              </Button>
            </div>

            {experienceItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg mb-4 max-w-md">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-lg font-semibold">{item.company}</p>
                  <Button
                    onClick={() => deleteExperience(item.id)} 
                    className="bg-[#F45050] text-white"
                    size="small"
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">{item.position}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Employment Type</p>
                      <p className="text-gray-600 text-sm">{item.employmentType}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Location</p>
                      <p className="text-gray-600 text-sm">{item.location || "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Start Date</p>
                      <p className="text-gray-600 text-sm">{moment(item.startDate).format("DD/MM/YYYY")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">End Date</p>
                      <p className="text-gray-600 text-sm">
                        {item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Status</p>
                    <p className="text-gray-600 text-sm">{item.status}</p>
                  </div>
                  <p className="text-blue-600 text-sm">{item.description || "No description"}</p>
                  <p className="text-gray-600 text-sm">Skills: {item.skills.join(", ") || "None"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Section */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Achievements Information</h1>
                <p className="text-gray-600 mt-1">Your awards and achievements</p>
              </div>
              <Button
                className="bg-[#77C4FE] text-white"
                icon={<PlusOutlined />}
                onClick={() => setIsAchievementModalVisible(true)}
              >
                Add Achievement
              </Button>
            </div>

            {achievementItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg mb-4 max-w-md">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-lg font-semibold">{item.award}</p>
                  <Button
                    onClick={() => deleteAchievement(item.id)} 
                    className="bg-[#F45050] text-white"
                    size="small"
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Date</p>
                    <p className="text-gray-600 text-sm">{moment(item.date).format("DD/MM/YYYY")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Status</p>
                    <p className="text-gray-600 text-sm">{item.status}</p>
                  </div>
                  <p className="text-blue-600 text-sm">{item.description || "No description"}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <Form.Item name="isAdmin" valuePropName="checked" className="mb-0">
              <Checkbox className="text-lg">Is Admin</Checkbox>
            </Form.Item>
          </div>

          <Form.Item className="flex justify-end mt-8">
            <Button
              htmlType="submit"
              className="px-8 py-3 h-auto bg-[#77C4FE] text-white"
              loading={isLoading}
              disabled={uploading}
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>

        {/* Education Modal */}
        <Modal
          title="Add Education"
          open={isEducationModalVisible}
          onCancel={() => setIsEducationModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={educationForm} onFinish={onEducationFinish} layout="vertical">
            <Form.Item
              name="institution"
              label="Institution Name"
              rules={[{ required: true, message: "Please input institution name!" }]}
            >
              <Input placeholder="Enter institution name" />
            </Form.Item>

            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: "Please select degree!" }]}
            >
              <Select placeholder="Select degree">
                <Option value="Bachelor">Bachelor's Degree</Option>
                <Option value="Master">Master's Degree</Option>
                <Option value="PhD">PhD</Option>
                <Option value="Associate">Associate Degree</Option>
                <Option value="Diploma">Diploma</Option>
                <Option value="Certificate">Certificate</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="field"
              label="Field of Study"
              rules={[{ required: true, message: "Please input field of study!" }]}
            >
              <Input placeholder="Enter field of study" />
            </Form.Item>

            <Form.Item name="grade" label="Grade">
              <Input placeholder="e.g., 3.8, A, First Class" />
            </Form.Item>

            <Form.Item name="skills" label="Skills (comma-separated)">
              <Input placeholder="e.g., business, finance, communication" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: "Please select start date!" }]}
              >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item name="endDate" label="End Date">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </div>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Describe your education experience" />
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue="completed">
              <Radio.Group>
                <Radio value="current">Current</Radio>
                <Radio value="completed">Completed</Radio>
              </Radio.Group>
            </Form.Item>

            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setIsEducationModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Education
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Experience Modal */}
        <Modal
          title="Add Experience"
          open={isExperienceModalVisible}
          onCancel={() => setIsExperienceModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={experienceForm} onFinish={onExperienceFinish} layout="vertical">
            <Form.Item
              name="company"
              label="Company"
              rules={[{ required: true, message: "Please input company name!" }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>

            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: "Please input position!" }]}
            >
              <Input placeholder="Enter your position" />
            </Form.Item>

            <Form.Item
              name="employmentType"
              label="Employment Type"
              rules={[{ required: true, message: "Please select employment type!" }]}
            >
              <Select placeholder="Select employment type">
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Freelance">Freelance</Option>
                <Option value="Internship">Internship</Option>
              </Select>
            </Form.Item>

            <Form.Item name="location" label="Location">
              <Input placeholder="e.g., Dhaka, Bangladesh" />
            </Form.Item>

            <Form.Item name="skills" label="Skills (comma-separated)">
              <Input placeholder="e.g., business, finance, communication" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: "Please select start date!" }]}
              >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item name="endDate" label="End Date">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </div>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Describe your experience" />
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue="completed">
              <Radio.Group>
                <Radio value="current">Current</Radio>
                <Radio value="completed">Completed</Radio>
              </Radio.Group>
            </Form.Item>

            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setIsExperienceModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Experience
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Achievement Modal */}
        <Modal
          title="Add Achievement"
          open={isAchievementModalVisible}
          onCancel={() => setIsAchievementModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={achievementForm} onFinish={onAchievementFinish} layout="vertical">
            <Form.Item
              name="award"
              label="Award Name"
              rules={[{ required: true, message: "Please input award name!" }]}
            >
              <Input placeholder="Enter award name" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date!" }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Describe your achievement" />
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue="achieved">
              <Radio.Group>
                <Radio value="achieved">Achieved</Radio>
                <Radio value="pending">Pending</Radio>
              </Radio.Group>
            </Form.Item>

            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setIsAchievementModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Achievement
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UpdateTeamForm;