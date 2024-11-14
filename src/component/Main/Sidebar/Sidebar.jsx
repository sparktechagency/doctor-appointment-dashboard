/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BiCalendarEdit } from "react-icons/bi";
import { HiOutlineDatabase } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { IoChatbubblesOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiCurrencyCircleDollar, PiUsersThree } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import LogoImage from "../../../assets/auth/Logo.png";
import { logoutUser } from "../../../redux/features/auth/authSlice";



const sidebarItems = [
  {
    path: "/",
    name: "Dashboard",
    icon: <LuLayoutDashboard className="size-8" />,
  },
  {
    path: "/users",
    name: "Users",
    icon: <PiUsersThree className="size-8" />,
  },
  {
    path: "/appointment",
    name: "Appointment",
    icon: <BiCalendarEdit className="size-8" />,
  },
  {
    path: "/chat",
    name: "Chat",
    icon: <IoChatbubblesOutline className="size-8" />,
  },
  // laboratory-test-request
  {
    path: "/laboratory-test-request",
    name: "Laboratory Test Request",
    icon: <IoChatbubblesOutline className="size-8" />,
  },
  {
    path: "/earnings",
    name: "Earnings",
    icon: <PiCurrencyCircleDollar className="size-8" />,
  },
  {
    path: "/subscriptions",
    name: "Subscriptions",
    icon: <HiOutlineDatabase className="size-8" />,
  },
  {
    path: "/about",
    name: "About Profile",
    icon: <IoPersonOutline className="size-8" />, // About Profile icon updated
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <IoSettingsOutline className="size-8" />,
  },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth");
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[350px] h-full bg-primary fixed overflow-y-scroll">
        <div className="flex flex-col justify-center items-center pt-5 gap-2 text-white bg-[#FFFFFF99]">
          <img src={LogoImage} alt="logo" className="w-46 h-24 mb-5" />
        </div>
        <ul className="w-full flex flex-col gap-3 mt-[15px]">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary px-10 py-4 flex items-center gap-3 text-[#FFFFFF]"
                  : "px-10 py-4 flex items-center gap-3 text-[#FFFFFF]"
              }
            >
              {item?.icon}
              <h>{item.name}</h>
            </NavLink>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-10 py-4 text-white mt-[15px]"
        >
          <IoIosLogOut className="size-8" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-primary shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col justify-center items-center pt-5 gap-2 text-white bg-[#FFFFFF99]">
        <img src={LogoImage} alt="logo" className="w-46 h-24 mb-5" />
        </div>
        <ul className="w-full flex flex-col gap-3">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={toggleSidebar} // Close sidebar on link click
              className={({ isActive }) =>
                isActive
                  ? "bg-primary px-10 py-4 flex items-center gap-3 text-[#FFFFFF]"
                  : "px-10 py-4 flex items-center gap-3 text-[#FFFFFF]"
              }
            >
              {item?.icon}
              <h>{item.name}</h>
            </NavLink>
          ))}
        </ul>
        <button
          onClick={() => {
            handleLogout();
            toggleSidebar()
          }}
          className="flex items-center gap-2 px-10  text-white"
        >
          <IoIosLogOut className="size-8" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
