import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { AvatarGroup, DashboardLayout } from "../../components";
import axios from "axios";
import toast from "react-hot-toast";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);

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
        const taskInfo = response.data.task;
        setTask(taskInfo);
      }
    } catch (error) {
      console.log("Error fetching task details: ", error);
    }
  };

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist];

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;

      const isNowCompleted = todoChecklist[index].completed;

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/task/${id}/todo`,
          {
            todoChecklist,
          },
          { withCredentials: true },
        );

        if (response.status === 200) {
          setTask(response.data?.task || task);

          if (isNowCompleted) {
            toast.success("Task marked as completed!");
          } else {
            toast.success("Task unmarked!");
          }
        } else {
          todoChecklist[index].completed = !todoChecklist[index].completed;
          toast.error("Failed to update todo checklist.");
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
        toast.error("Something went wrong updating the checklist.");
      }
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsById();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="mt-5 px-4 sm:px-6 lg:px-8">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <div className="flex flex-col space-y-3">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    {task?.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusTagColor(
                        task?.status,
                      )}`}
                    >
                      {task?.status}
                      <span className="ml-1.5 w-2 h-2 rounded-full bg-current opacity-80"></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <InfoBox label="Description" value={task?.description} />
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-6 md:col-span-3">
                    <InfoBox label={"Priority"} value={task?.priority} />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <InfoBox
                      label={"Due Date"}
                      value={
                        task?.dueDate
                          ? moment(task?.dueDate).format("Do MMM YYYY")
                          : "N/A"
                      }
                    />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Created By
                    </label>
                    <div className="flex flex-wrap gap-2 mt-0.5">
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

                  <div className="col-span-6 md:col-span-3">
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Assigned To
                    </label>
                    <div className="mt-0.5">
                      <AvatarGroup
                        avatars={
                          task?.assignedTo?.map(
                            (item) => item?.profilePicture,
                          ) || []
                        }
                        maxVisible={5}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Todo Checklist
                  </label>

                  {task?.todoChecklist?.map((item, index) => (
                    <TodoCheckList
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <button
                    onClick={() =>
                      navigate(`/user/workspace/${id}`, {
                        state: { taskTitle: task?.title },
                      })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
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
                    Open Collaborative Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <p className="text-[13px] md:text-sm font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border border-gray-300 rounded outline-none cursor-pointer"
      />

      <p className="text-sm text-gray-800">{text}</p>
    </div>
  );
};
