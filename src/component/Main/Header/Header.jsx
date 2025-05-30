/* eslint-disable react/prop-types */

import { FiMenu } from "react-icons/fi";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-[99%] p-2 mx-2  flex justify-between items-center text-white sticky top-0 left-0 z-10 bg-[#77C4FE] rounded-md">
      <div className="flex items-center gap-3  py-1 px-3  rounded">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl">Welcome, {user?.fullName}</h1>
          <span className="text-sm">Have a nice day</span>
        </div>
      </div>

      <div className="flex justify-between items-start gap-8 pl-5">
        <Link to={"/notification"}>
          <h1 className="relative">
            <MdOutlineNotificationsActive className="size-10 bg-primary p-2 rounded-full" />{" "}
            <span className="absolute top-0 right-0 text-xs   size-5 flex justify-center items-center rounded-full  p-2">
            </span>
          </h1>
        </Link>
        <img
          onClick={() => navigate("/personal-info")}
          src={user?.image?.url ? `${imageBaseUrl}${user.image.url}` : "/src/assets/user.png"}
          className="size-10 rounded-full cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Header;
