import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? "https://devteamup.onrender.com"
    : "http://localhost:3000";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  autoConnect: false // 🚨 KEY LINE
});
