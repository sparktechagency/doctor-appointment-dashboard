import { Pagination } from "antd";
import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data
  const notifications = [
    { id: 1, message: "You have a new order delivery for Luke.", time: "2 Min Ago" },
    { id: 2, message: "You have shipment 5 days for Luke.", time: "2 Min Ago" },
    { id: 3, message: "You have a new message from Luke.", time: "2 Min Ago" },
    { id: 4, message: "You have a new message from Luke.", time: "2 Min Ago" },
    { id: 5, message: "You have a new message from Luke.", time: "2 Min Ago" },
    // { id: 6, message: "You have a new message from Luke.", time: "2 Min Ago" },
    // { id: 7, message: "You have shipment 5 days for Luke.", time: "2 Min Ago" },
    // { id: 8, message: "You have a new order delivery for Luke.", time: "2 Min Ago" },
  ];

  const pageSize = 5;

  // Pagination Logic
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4  rounded-xl m-2 h-[88vh] w-full">
      <h1 className="text-2xl font-bold mb-4">Notification</h1>

      <div className="space-y-4 ">
        {paginatedNotifications.map((item) => (
          <div key={item.id} className=" rounded-md p-4 flex items-center space-x-4 border border-[#77C4FE]">
            <div className="text-[#77C4FE] border border-[#77C4FE] rounded-full p-2">
              <IoMdNotificationsOutline size={30} />
            </div>
            <div>
              <p className="font-semibold">{item.message}</p>
              <p className="text-gray-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Centering the Pagination */}
      <div className="mt-10 flex justify-center">
        <Pagination
          current={currentPage}
          total={notifications.length}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Notification;
