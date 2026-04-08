import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout, TaskCard } from "../../components";
import axios from "axios";

const AdminUserDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const user = state?.user || null;

  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);

  const getUserTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/task`, {
        withCredentials: true,
      });

      if (response?.data?.tasks) {
        const allTasks = response.data.tasks;

        const filteredAssigned = allTasks.filter((task) =>
          task.assignedTo?.some(
            (assignedUser) => assignedUser._id === id || assignedUser === id,
          ),
        );

        const filteredCreated = allTasks.filter((task) =>
          task.createdBy?.some(
            (creator) => creator._id === id || creator === id,
          ),
        );

        setAssignedTasks(filteredAssigned);
        setCreatedTasks(filteredCreated);
      }
    } catch (error) {
      console.log("Error fetching user tasks: ", error);
    }
  };

  useEffect(() => {
    if (id) {
      getUserTasks();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <div className="mt-5 px-4 sm:px-6 lg:px-8 pb-10">
        {user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover border-4 border-blue-50 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h2>
                {user.role === "admin" && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase tracking-wider border border-purple-200">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-gray-500 mt-1">{user.email}</p>

              <div className="flex gap-4 mt-4">
                <div className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-md text-sm font-medium border border-yellow-100">
                  Pending: {user.pendingTasks || 0}
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-100">
                  In Progress: {user.inProgressTasks || 0}
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-100">
                  Completed: {user.completedTasks || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role !== "admin" && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Assigned Tasks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assignedTasks?.length > 0 ? (
                assignedTasks.map((item) => (
                  <TaskCard
                    key={`assigned_${item._id}`}
                    title={item.title}
                    description={item.description}
                    priority={item.priority}
                    status={item.status}
                    progress={item.progress}
                    createdAt={item.createdAt}
                    dueDate={item.dueDate}
                    assignedTo={item.assignedTo?.map((u) => u.profilePicture)}
                    completedTodoCount={
                      item.todoChecklist?.filter((todo) => todo.completed)
                        .length || 0
                    }
                    todoChecklist={item.todoChecklist || []}
                    onClick={() => navigate(`/admin/task-details/${item._id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-white rounded-xl border border-gray-200">
                  <p className="text-gray-500">
                    No tasks assigned to this user.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {user?.role === "admin" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Created Tasks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {createdTasks?.length > 0 ? (
                createdTasks.map((item) => (
                  <TaskCard
                    key={`created_${item._id}`}
                    title={item.title}
                    description={item.description}
                    priority={item.priority}
                    status={item.status}
                    progress={item.progress}
                    createdAt={item.createdAt}
                    dueDate={item.dueDate}
                    assignedTo={item.assignedTo?.map((u) => u.profilePicture)}
                    completedTodoCount={
                      item.todoChecklist?.filter((todo) => todo.completed)
                        .length || 0
                    }
                    todoChecklist={item.todoChecklist || []}
                    onClick={() => navigate(`/admin/task-details/${item._id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-white rounded-xl border border-gray-200">
                  <p className="text-gray-500">
                    This admin has not created any tasks yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUserDetails;
