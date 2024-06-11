import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const port = 8000;

const userSocketMap = new Map();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? ['https://mygameplanner.xyz', 'https://www.mygameplanner.xyz'] : 'http://localhost:3000',
    methods: ['GET', 'POST']
  };

app.use(cors(corsOptions));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions
});

io.on("connection", (socket) => {

    console.log(`User ${socket.id} connected`);

    socket.on("registerUser", (userId) => {
        console.log(`User ${socket.id} registered as ${userId}`)
        userSocketMap.set(userId, socket.id);
    });

    socket.on('joinGroup', (room) => {
        console.log(`User ${socket.id} joined room ${room}`)
        socket.join(room);
    });

    socket.on('leaveGroup', (userGroupData) => {
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

    socket.on("groupUpdate", (data) => { 
        socket.to(data.target).emit("serverGroupUpdate", { groupId: data.target})
    });

    socket.on("removeFromGroup", (data) => {
        const socketId = userSocketMap.get(data.userId);
        socket.to(socketId).emit("serverRemoveFromGroup", "You have been removed from the group")
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

httpServer.listen(port, () => {
console.log(`Server running on port ${port}`);
});
