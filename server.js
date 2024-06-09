import { Server } from "socket.io";
import { createServer } from "node:http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {

  const userSocketMap = new Map();

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {

    socket.on("registerUser", (userId) => {
      console.log(`User ${socket.id} registered as ${userId}`)
      userSocketMap.set(userId, socket.id);
    });
    
    socket.on('joinGroup', (room) => {
      console.log(`User ${socket.id} joined room ${room}`)
      socket.join(room);
    });

    socket.on('removeFromGroup', (userGroupData) => {
      const socketId = userSocketMap.get(userGroupData.userId);
      const room = userGroupData.groupId;

      if (socketId) {
        const userSocket = io.sockets.sockets.get(socketId);
        if (userSocket) {
          userSocket.leave(room);
          console.log(`User ${userGroupData.userId} with socket id ${socketId} left room ${room}`);
        } else {
          console.log(`Socket not found for id ${socketId}`);
        }
      } else {
        console.log(`User ${userGroupData.userId} is not connected`);
      }
    });
  
    socket.on("notification", (data) => {
      socket.to(data.target).emit("serverNotification", data)
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});