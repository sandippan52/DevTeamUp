import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    socket = io(BACKEND_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};
