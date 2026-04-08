import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../store/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";
import axios from "axios";
import toast from "react-hot-toast";

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [SideMenuData, setSideMenuData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogut();
      return;
    }

    navigate(route);
  };

  const handleLogut = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signout`,
      );

      if (response.data) {
        dispatch(signOutSuccess());

        toast.success("Logged out successfully");

        navigate("/login");
      }
    } catch (error) {
      console.log(error);

      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser?.role === "admin" ? SIDE_MENU_DATA : USER_SIDE_MENU_DATA,
      );
    }

    return () => {};
  }, [currentUser]);

  return (
    <div className="w-64 p-6 h-full flex flex-col lg:border-r lg:border-gray-200">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-blue-200">
          <img
            src={currentUser?.profilePicture || null}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

        {currentUser?.role === "admin" && (
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
            Admin
          </div>
        )}

        <h5 className="text-lg font-semibold text-gray-800">
          {currentUser?.name || ""}
        </h5>

        <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
      </div>

      <div className="flex-1 overscroll-y-auto">
        {SideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === item.label
                ? "text-blue-500 bg-linear-to-r from-blue-50/40 to-blue-100/50"
                : ""
            } py-3 px-6 mb-3 cursor-pointer`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-2xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
