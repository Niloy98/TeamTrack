import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  AvatarGroup,
  DashboardLayout,
  Modal,
  DeleteAlert,
} from "../../components";
import axios from "axios";
import toast from "react-hot-toast";

const AdminTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getTaskDetailsById = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/task/${id}`,
        { withCredentials: true },
      );
      if (response.data) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.log("Error fetching task details: ", error);
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/task/${id}`, {
        withCredentials: true,
      });
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully!");
      navigate("/admin/tasks");
    } catch (error) {
      console.log("Error deleting task: ", error);
      toast.error("Failed to delete task.");
    }
  };

  useEffect(() => {
    if (id) getTaskDetailsById();
  }, [id]);

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="mt-5 px-4 sm:px-6 lg:px-8 pb-10">
        {task && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
              <div className="flex flex-col space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  {task?.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusTagColor(task?.status)}`}
                  >
                    {task?.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    navigate("/admin/create-task", { state: { taskId: id } })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                >
                  <MdEdit className="text-lg" /> Update
                </button>
                <button
                  onClick={() => setOpenDeleteAlert(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                >
                  <MdDelete className="text-lg" /> Delete
                </button>
              </div>
            </div>

            <div className="mt-6">
              <InfoBox label="Description" value={task?.description} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              <InfoBox label={"Priority"} value={task?.priority} />

              <InfoBox
                label={"Due Date"}
                value={
                  task?.dueDate
                    ? moment(task?.dueDate).format("Do MMM YYYY")
                    : "N/A"
                }
              />

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-2">
                  Created By
                </label>
                <div className="flex flex-wrap gap-2">
                  {task?.createdBy?.map((creator, index) => (
                    <div
                      key={`creator_${index}`}
                      className="flex items-center gap-2 bg-gray-50/50 p-1.5 pr-3 rounded-full border border-gray-100 w-fit"
                    >
                      {creator?.profilePicture ? (
                        <img
                          src={creator.profilePicture}
                          alt={creator.name}
                          className="w-6 h-6 rounded-full object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                          {creator?.name?.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-700">
                        {creator?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-2">
                  Assigned To
                </label>
                <div>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => item?.profilePicture) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="text-xs font-medium text-slate-500 mb-2 block">
                Todo Checklist (
                {task?.todoChecklist?.filter((t) => t.completed).length}/
                {task?.todoChecklist?.length} Completed)
              </label>
              <div className="space-y-2">
                {task?.todoChecklist?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={item?.completed}
                      readOnly
                      className="w-4 h-4 text-primary bg-gray-100 border border-gray-300 rounded outline-none cursor-not-allowed opacity-70"
                    />
                    <p
                      className={`text-sm ${item.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <button
                onClick={() =>
                  navigate(`/admin/workspace/${id}`, {
                    state: { taskTitle: task?.title },
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                View Live Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title={"Delete Task"}
      >
        <DeleteAlert
          content="Are you sure you want to delete this task? This action cannot be undone."
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default AdminTaskDetails;

const InfoBox = ({ label, value }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 block mb-1">
      {label}
    </label>
    <p className="text-[14px] font-medium text-gray-800 bg-gray-50/50 p-2 rounded border border-gray-100 min-h-9.5">
      {value || "No description provided."}
    </p>
  </div>
);
