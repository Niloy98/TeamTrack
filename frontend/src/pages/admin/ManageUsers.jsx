import React, { useEffect, useState } from "react";
import { DashboardLayout, UserCard } from "../../components";
import axios from "axios";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get-all-users`,
        {
          withCredentials: true,
        },
      );

      if (response.data?.userWithTaskCounts.length > 0) {
        setAllUsers(response.data.userWithTaskCounts);
      }
    } catch (error) {
      console.log("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    getAllUsers();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <div className="mt-5 mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Team Members</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
