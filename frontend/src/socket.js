import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://hack-collab-nu.vercel.app");

console.log("🔌 Socket URL:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;