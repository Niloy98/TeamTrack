import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  const roomUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("join_task", ({ taskId, user }) => {
      socket.join(taskId);

      socket.data.taskId = taskId;
      socket.data.user = user;

      if (!roomUsers.has(taskId)) {
        roomUsers.set(taskId, []);
      }

      const currentRoomUsers = roomUsers.get(taskId);
      currentRoomUsers.push({ ...user, socketId: socket.id });
      roomUsers.set(taskId, currentRoomUsers);

      io.to(taskId).emit("active_users", currentRoomUsers);
    });

    socket.on("send_code_update", (data) => {
      socket.to(data.taskId).emit("receive_code_update", data.newCode);
    });

    socket.on("disconnect", () => {
      const taskId = socket.data.taskId;

      if (taskId && roomUsers.has(taskId)) {
        let currentRoomUsers = roomUsers.get(taskId);

        currentRoomUsers = currentRoomUsers.filter(
          (u) => u.socketId !== socket.id,
        );

        if (currentRoomUsers.length === 0) {
          roomUsers.delete(taskId);
        } else {
          roomUsers.set(taskId, currentRoomUsers);
          io.to(taskId).emit("active_users", currentRoomUsers);
        }
      }
    });
  });

  return io;
};
