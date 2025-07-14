// src/app/notification/page.jsx
import { useState } from 'react';
import { Pagination } from 'antd';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { formatDistanceToNow } from 'date-fns';

import { 
  useGetNotificationsQuery, 

} from '../../../redux/features/auth/notification';

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading, isError } = useGetNotificationsQuery();



  const notifications = data?.data?.attributes?.notifications || [];
  const totalUnread = data?.data?.attributes?.totalUnread || 0;



  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Pagination Logic
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <div className="text-center py-10">Loading notifications...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading notifications</div>;

  return (
    <div className="p-4 rounded-xl m-2 h-[88vh] w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {totalUnread > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {paginatedNotifications.map((notification) => (
          <div 
            key={notification._id} 
            className={`rounded-md p-4 flex items-start space-x-4 border ${
              notification.status === 'unread' 
                ? 'border-[#77C4FE] bg-blue-50' 
                : 'border-gray-200'
            }`}
            
          >
            <div className="flex-shrink-0">
              {notification.icon ? (
                <img
                  src={notification.icon} 
                  alt="Notification icon" 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              ) : (
                <div className="text-[#77C4FE] border border-[#77C4FE] rounded-full p-2">
                  <IoMdNotificationsOutline className="text-[#77C4FE]" size={30} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${
                notification.status === 'unread' ? 'text-blue-800' : 'text-gray-800'
              }`}>
                {notification.title}
              </p>
              <p className="text-gray-600">{notification.content}</p>
              <p className="text-gray-500 text-sm mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
            {notification.status === 'unread' && (
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {notifications.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            current={currentPage}
            total={notifications.length}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            className="border-[#77C4FE]"
          />
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No notifications available
        </div>
      )}
    </div>
  );
};

export default Notification;