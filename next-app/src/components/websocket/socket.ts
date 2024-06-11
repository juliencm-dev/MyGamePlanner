"use client";

import { io } from "socket.io-client";

const socketUrl =
  process.env.NODE_ENV === "production"
    ? "https://ws.mygameplanner.xyz"
    : "http://localhost:8000";

export const socket = io(socketUrl);
