import { Button, Form, Input, Modal, Radio, Select, DatePicker, Upload, message, Checkbox  } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { IoChevronBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCreateTeamMemberMutation } from "../../../redux/features/product/teamApi";
import moment from "moment";

const { Option } = Select;

const AddInformation = () => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
    const navigate = useNavigate();
  const [educationForm] = Form.useForm();
  const [experienceForm] = Form.useForm();
  const [achievementForm] = Form.useForm();
  const [createTeamMember, { isLoading }] = useCreateTeamMemberMutation();

  // Initialize state with user data if available
  const [educationItems, setEducationItems] = useState(
    user?.degrees?.map((deg, index) => ({
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
    })) || []
  );
  const [experienceItems, setExperienceItems] = useState(
    user?.experience?.map((exp, index) => ({
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
    })) || []
  );
  const [achievementItems, setAchievementItems] = useState(
    user?.achievements?.map((ach, index) => ({
      id: index + 1,
      award: ach.title,
      date: ach.date,
      status: ach.status,
      description: ach.description || "",
    })) || []
  );
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || null);
  const [uploading, setUploading] = useState(false);

  // State for modals
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [isExperienceModalVisible, setIsExperienceModalVisible] = useState(false);
  const [isAchievementModalVisible, setIsAchievementModalVisible] = useState(false);

  // Custom upload function for profile image
  const handleImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      setUploading(true);
      
      // Store the file object and create a preview URL
      setProfileImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
      
      onSuccess({ url: previewUrl }, file);
      message.success(`${file.name} file ready for upload`);
    } catch (error) {
      setUploading(false);
      onError(error);
      message.error(`${file.name} file upload failed.`);
    } finally {
      setUploading(false);
    }
  };

  // Handle main form submission
  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('designation', values.designation);
      formData.append('specialties', values.specialties);
      formData.append('about', values.about);
      formData.append('callingCode', values.callingCode || "+880");
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('email', values.email);
       formData.append('isAdmin', values.isAdmin);
      // Append media links
      formData.append('media[facebook]', values.facebook || '');
      formData.append('media[instagram]', values.instagram || '');
      formData.append('media[linkedin]', values.linkedin || '');
      formData.append('media[X]', values.X || '');
      
      // Append profile image if exists
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      } else {
        formData.append('profileImage', profileImagePreview || "/Uploads/users/user.png");
      }
      
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

      // Make the API call with FormData
      const response = await createTeamMember(formData).unwrap();
      
      if (response.code === 201) {
        message.success("Team member created successfully!");
        form.resetFields();
        setEducationItems([]);
        setExperienceItems([]);
        setAchievementItems([]);
        setProfileImageFile(null);
        setProfileImagePreview(null);
        navigate('/teammember'); 
      } else {
        message.error(response.message || "Failed to create team member");
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to create team member");
    }
  };

  // Education form handlers
  const onEducationFinish = (values) => {
    const newId = Math.max(...educationItems.map((item) => item.id), 0) + 1;
    setEducationItems([
      ...educationItems,
      {
        id: newId,
        institution: values.schoolName,
        degree: values.degree,
        field: values.subject,
        grade: values.grade,
        startDate: values.startDate ? moment(values.startDate).toISOString() : new Date().toISOString(),
        endDate: values.endDate ? moment(values.endDate).toISOString() : null,
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
        startDate: values.startDate ? moment(values.startDate).toISOString() : new Date().toISOString(),
        endDate: values.endDate ? moment(values.endDate).toISOString() : null,
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
        date: values.date ? moment(values.date).toISOString() : new Date().toISOString(),
        status: values.status,
        description: values.description,
      },
    ]);
    setIsAchievementModalVisible(false);
    achievementForm.resetFields();
    message.success("Achievement added successfully!");
  };

  // Delete functions
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

  // Upload props for profile image
 const uploadProps = {
    name: 'profileImage',
    multiple: false,
    showUploadList: false,
    customRequest: handleImageUpload,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      return isImage && isLt5M;
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setUploading(true);
        return;
      }
    },
  };

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
                src={profileImagePreview || "https://via.placeholder.com/128"}
                alt="Profile"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Upload {...uploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploading}
                  disabled={uploading}
                >
                  Upload Photo
                </Button>
              </Upload>
              <span className="text-lg font-semibold uppercase">{user?.role || "User"}</span>
            </div>
          </div>
        </div>

        {/* Personal Details Form */}
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            firstName: user?.firstName,
            lastName: user?.lastName,
            designation: user?.designation,
            specialties: user?.specialties,
            about: user?.about,
            callingCode: user?.callingCode || "+880",
            phoneNumber: user?.phoneNumber,
            email: user?.email,
            facebook: user?.media?.facebook,
            instagram: user?.media?.instagram,
            linkedin: user?.media?.linkedin,
            X: user?.media?.X,
          }}
        >
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item
              name="firstName"
              label="First Name"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input phone number!" }]}
            >
              <Input addonBefore={<Form.Item name="callingCode" noStyle><Select defaultValue="+880"><Option value="+880">+880</Option></Select></Form.Item>} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              className="w-full md:w-1/2"
              rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item
              name="designation"
              label="Designation"
              className="w-full md:w-1/2"
              rules={[{ required: true, message: "Please input designation!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="specialties" label="Specialties" className="w-full md:w-1/2">
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="about" label="About Me">
            <TextArea rows={5} />
          </Form.Item>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item name="facebook" label="Facebook Link" className="w-full md:w-1/2">
              <Input />
            </Form.Item>
            <Form.Item name="instagram" label="Instagram Link" className="w-full md:w-1/2">
              <Input />
            </Form.Item>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Form.Item name="linkedin" label="LinkedIn Link" className="w-full md:w-1/2">
              <Input />
            </Form.Item>
            <Form.Item name="X" label="X (Twitter) Link" className="w-full md:w-1/2">
              <Input />
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
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsEducationModalVisible(true)}
              >
                Add Education
              </Button>
            </div>

            {educationItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-lg font-semibold">{item.institution}</p>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteEducation(item.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">{item.field}</p>
                    <p className="text-gray-600">{item.degree}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Start Date</p>
                      <p className="text-gray-600">{moment(item.startDate).format("DD/MM/YYYY")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">End Date</p>
                      <p className="text-gray-600">{item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Grade</p>
                      <p className="text-gray-600">{item.grade || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Status</p>
                      <p className="text-gray-600">{item.status}</p>
                    </div>
                  </div>
                  <p className="text-blue-600 text-sm">{item.description || "No description"}</p>
                  <p className="text-gray-600">Skills: {item.skills.join(", ") || "None"}</p>
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
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsExperienceModalVisible(true)}
              >
                Add Experience
              </Button>
            </div>

            {experienceItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-lg font-semibold">{item.company}</p>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteExperience(item.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">{item.position}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Employment Type</p>
                      <p className="text-gray-600">{item.employmentType}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600">{item.location || "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Start Date</p>
                      <p className="text-gray-600">{moment(item.startDate).format("DD/MM/YYYY")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">End Date</p>
                      <p className="text-gray-600">{item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Status</p>
                    <p className="text-gray-600">{item.status}</p>
                  </div>
                  <p className="text-blue-600 text-sm">{item.description || "No description"}</p>
                  <p className="text-gray-600">Skills: {item.skills.join(", ") || "None"}</p>
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
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAchievementModalVisible(true)}
              >
                Add Achievement
              </Button>
            </div>

            {achievementItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-lg font-semibold">{item.award}</p>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteAchievement(item.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Date</p>
                    <p className="text-gray-600">{moment(item.date).format("DD/MM/YYYY")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Status</p>
                    <p className="text-gray-600">{item.status}</p>
                  </div>
                  <p className="text-blue-600 text-sm">{item.description || "No description"}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="">
             <Form.Item 
          name="isAdmin"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox>Is Admin</Checkbox>
        </Form.Item>
          </div>

       <Form.Item className="flex justify-end mt-8">
            <Button
              type="primary"
              htmlType="submit"
              className="px-8 py-3 h-auto"
              loading={isLoading}
              disabled={uploading}
            >
              Save Profile
            </Button>
          </Form.Item>
        </Form>
        {/* Education Modal */}
        <Modal
          title="Add Education"
          open={isEducationModalVisible}
          onCancel={() => setIsEducationModalVisible(false)}
          footer={null}
          width={700}
          destroyOnClose
        >
          <Form form={educationForm} onFinish={onEducationFinish} layout="vertical">
            <Form.Item
              name="schoolName"
              label="School/University Name"
              rules={[{ required: true, message: "Please input school name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: "Please select degree!" }]}
            >
              <Select placeholder="Select degree">
                <Option value="bachelor">Bachelor's Degree</Option>
                <Option value="master">Master's Degree</Option>
                <Option value="phd">PhD</Option>
                <Option value="associate">Associate Degree</Option>
                <Option value="diploma">Diploma</Option>
                <Option value="certificate">Certificate</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="subject"
              label="Field of Study"
              rules={[{ required: true, message: "Please input field of study!" }]}
            >
              <Input />
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
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue="completed">
              <Radio.Group>
                <Radio value="current">Current</Radio>
                <Radio value="completed">Completed</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Save Education
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Experience Modal */}
        <Modal
          title="Add Experience"
          open={isExperienceModalVisible}
          onCancel={() => setIsExperienceModalVisible(false)}
          footer={null}
          width={700}
          destroyOnClose
        >
          <Form form={experienceForm} onFinish={onExperienceFinish} layout="vertical">
            <Form.Item
              name="company"
              label="Company"
              rules={[{ required: true, message: "Please input company name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: "Please input position!" }]}
            >
              <Input />
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
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue="completed">
              <Radio.Group>
                <Radio value="current">Current</Radio>
                <Radio value="completed">Completed</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Save Experience
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Achievement Modal */}
         <Modal
          title="Add Achievement"
          open={isAchievementModalVisible}
          onCancel={() => setIsAchievementModalVisible(false)}
          footer={null}
          width={700}
          destroyOnClose
        >
          <Form form={achievementForm} onFinish={onAchievementFinish} layout="vertical">
            <Form.Item
              name="award"
              label="Award Name"
              rules={[{ required: true, message: "Please input award name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date!" }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue="achieved">
              <Radio.Group>
                <Radio value="achieved">Achieved</Radio>
                <Radio value="pending">Pending</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Save Achievement
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AddInformation;
