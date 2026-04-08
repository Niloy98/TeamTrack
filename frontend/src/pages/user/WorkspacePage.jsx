import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components";

const SOCKET_URL = import.meta.env.VITE_API_URL.split("/api")[0];

const WorkspacePage = () => {
  const { id: taskId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const taskTitle = state?.taskTitle || "Task";
  const { currentUser } = useSelector((state) => state.user);

  const [code, setCode] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchWorkspace = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/task/${taskId}/workspace`,
        { withCredentials: true },
      );
      if (response.data) {
        setCode(response.data.workspaceCode || "");
      }
    } catch (error) {
      console.log("Error fetching workspace code", error);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit("join_task", {
      taskId,
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        profilePicture: currentUser.profilePicture,
      },
    });

    socketRef.current.on("receive_code_update", (newCode) => {
      setCode(newCode);
    });

    socketRef.current.on("active_users", (users) => {
      const uniqueUsers = Array.from(
        new Map(users.map((u) => [u._id, u])).values(),
      );
      setActiveUsers(uniqueUsers);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [taskId, currentUser]);

  const handleEditorChange = (value) => {
    setCode(value);
    socketRef.current.emit("send_code_update", { taskId, newCode: value });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/task/${taskId}/workspace`,
          { workspaceCode: value },
          { withCredentials: true },
        );
      } catch (error) {
        toast.error("Failed to auto-save code.");
      }
    }, 2000);
  };

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="mt-5 px-4 sm:px-6 lg:px-8 h-[80vh] flex flex-col">
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex-1 flex flex-col">
          <div className="bg-gray-800 text-white px-4 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <span className="text-sm font-semibold truncate">
              {taskTitle} - Workspace
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Collaborators:</span>

              <div className="flex -space-x-2">
                {activeUsers.map((u, i) => (
                  <React.Fragment key={i}>
                    {u.profilePicture ? (
                      <img
                        src={u.profilePicture}
                        alt={u.name}
                        title={u.name}
                        className="h-8 w-8 rounded-full ring-2 ring-gray-800 object-cover"
                      />
                    ) : (
                      <div
                        title={u.name}
                        className="h-8 w-8 rounded-full ring-2 ring-gray-800 bg-blue-500 flex items-center justify-center text-xs font-bold uppercase text-white shadow-sm"
                      >
                        {u.name.charAt(0)}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={() => navigate(`/user/task-details/${taskId}`)}
                className="ml-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
              >
                Back to Task
              </button>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkspacePage;
