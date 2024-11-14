import {
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Modal,
    Space,
    Table,
} from "antd";
import moment from "moment";
import { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
// import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const { Item } = Form;

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [params, setParams] = useState([]);
  const [date, setDate] = useState("");
  // const [allUser, setAllUser] = useState([]);
  const [user, setUser] = useState(null);
  // const { data, isFetching, isError, error } = useGetAllUsersQuery(params);

  const handleView = (record) => {
    console.log(record);
    setUser(record);
    setIsModalOpen(true);
  };

  const AllUserData = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      address_line1: "123 Main St, Springfield",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "123-456-7890",
      createdAt: "2023-01-15T10:15:30Z",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      address_line1: "456 Oak St, Metropolis",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "987-654-3210",
      createdAt: "2023-02-20T14:45:00Z",
    },
    {
      id: 3,
      fullName: "Alice Johnson",
      email: "alice.johnson@example.com",
      address_line1: "789 Maple Ave, Gotham",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "456-123-7890",
      createdAt: "2023-03-12T09:30:15Z",
    },
    {
      id: 4,
      fullName: "Bob Brown",
      email: "bob.brown@example.com",
      address_line1: "321 Elm St, Star City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "321-654-0987",
      createdAt: "2023-04-10T11:20:45Z",
    },
    {
      id: 5,
      fullName: "Cathy White",
      email: "cathy.white@example.com",
      address_line1: "654 Pine St, Central City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "654-321-0987",
      createdAt: "2023-05-15T13:30:50Z",
    },
    {
      id: 6,
      fullName: "David Green",
      email: "david.green@example.com",
      address_line1: "987 Birch St, Coast City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "789-012-3456",
      createdAt: "2023-06-20T08:15:10Z",
    },
    {
      id: 7,
      fullName: "Eva Black",
      email: "eva.black@example.com",
      address_line1: "135 Cedar St, Smallville",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "246-801-3579",
      createdAt: "2023-07-25T16:45:30Z",
    },
    {
      id: 8,
      fullName: "Frank Blue",
      email: "frank.blue@example.com",
      address_line1: "246 Cherry St, Happy Town",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "135-790-8642",
      createdAt: "2023-08-30T07:50:20Z",
    },
    {
      id: 9,
      fullName: "Grace Gray",
      email: "grace.gray@example.com",
      address_line1: "369 Willow St, Dreamland",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "852-963-7410",
      createdAt: "2023-09-05T10:10:10Z",
    },
    {
      id: 10,
      fullName: "Hank Red",
      email: "hank.red@example.com",
      address_line1: "159 Maplewood St, Wonder City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "963-852-7410",
      createdAt: "2023-10-12T09:05:25Z",
    },
    {
      id: 11,
      fullName: "Frank Blue",
      email: "frank.blue@example.com",
      address_line1: "246 Cherry St, Happy Town",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "135-790-8642",
      createdAt: "2023-08-30T07:50:20Z",
    },
    {
      id: 12,
      fullName: "Grace Gray",
      email: "grace.gray@example.com",
      address_line1: "369 Willow St, Dreamland",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "852-963-7410",
      createdAt: "2023-09-05T10:10:10Z",
    },
    {
      id: 13,
      fullName: "Hank Red",
      email: "hank.red@example.com",
      address_line1: "159 Maplewood St, Wonder City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "963-852-7410",
      createdAt: "2023-10-12T09:05:25Z",
    },
  ];

  const dataSource = AllUserData?.map((user, index) => ({
    key: user.id,
    si: index + 1,
    name: user?.fullName,
    email: user?.email,
    address: user?.address_line1,
    image: user?.image?.url,
    phone: user?.phone,
    createdAt: user?.createdAt,
  }));

  

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "index",
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? moment(text).format("DD MMM YYYY") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <BsInfoCircle
            onClick={() => handleView(record)}
            size={18}
            className="text-[#111111] cursor-pointer"
          />
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    let queryParams = [];
    const { username } = values;
    if (date) {
      queryParams.push({ name: "date", value: date });
    }
    if (username) {
      queryParams.push({ name: "userName", value: username });
    }
    // setParams(queryParams);
  };

  const handleDate = (date, dateString) => {
    setDate(dateString);
  };
  // useEffect(() => {
  //   if (isError && error) {
  //     setAllUser([]);
  //   } else if (data) {
  //     setAllUser(data?.data?.attributes?.user?.results);
  //   }
  // }, [data, isError, error]);

  return (
    <section>
      <div className="md:flex justify-between items-center ">
        <h1 className="md:text-2xl font-semibold  py-2 flex items-center">< MdKeyboardArrowLeft/> Users List</h1>
        <Form
          className="flex px-3 py-[22px] justify-between items-center p-2 "
          layout="inline"
          onFinish={onFinish}
        >
          <Item>
            <DatePicker placeholder="Date"  onChange={handleDate} />
          </Item>
          <Item name="username">
            <Input placeholder="User name" />
          </Item>
          <Item>
            <button className=" size-8 rounded-full flex justify-center items-center bg-primary text-white">
              <IoIosSearch className="size-5" />
            </button>
          </Item>
        </Form>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#D5EDFF",
            colorPrimary: "#1890ff", // Custom primary color
          },
          components: {
            Table: {
              headerBg: "#77C4FE",
              headerColor: "white",
              headerBorderRadius: 2,
            },
          },
        }}
      >
        <Table
          // loading={isFetching}
          pagination={{
            position: ["bottomCenter"],
            current: currentPage,
            onChange: setCurrentPage,
          }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          scroll={{ x: 800 }} 
        />
      </ConfigProvider>
      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <div className="text-black bg-primary">
          <img
            className="size-28 mx-auto rounded-full"
            src={`${imageBaseUrl}${user?.image}`}
            alt=""

          />
          <h1 className="text-center text-2xl font-semibold my-2">
            User Details
          </h1>
          <div className="p-5">
            <div className="flex justify-between py-3 border-b">
              <p>User Name : </p>
              <p>{user?.name || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Email : </p>
              <p>{user?.email || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Phone Number : </p>
              <p>{user?.phone || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Address : </p>
              <p>{user?.address || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3">
              <p>Joining Date :</p>
              <p>
                {user?.createdAt
                  ? moment(user.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Users;
