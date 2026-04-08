import React from "react";

const UserCard = ({ userInfo, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profilePicture}
            alt={userInfo?.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <p className="text-lg font-medium text-gray-800">
              {userInfo?.name}
            </p>
            <p className="text-sm text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="in-progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center p-2 rounded-lg border ${getStatusTagColor()}`}
    >
      <span className="text-lg font-bold">{count}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};
