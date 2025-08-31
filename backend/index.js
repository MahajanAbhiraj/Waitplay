import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";  // ✅ Import Socket.IO
import http from "http";  // ✅ Import HTTP module
import prisma from "./prismaClient.js";
import userRoute from "./routes/userRoute.js"; 
import adminRoute from "./routes/adminRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import tableRoute from "./routes/tableRoute.js";
import orderRoute from "./routes/orderRoute.js";
import menuRoute from "./routes/menuRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

dotenv.config();
const app = express();
const server = http.createServer(app);  // ✅ Create HTTP server

// ✅ Initialize Socket.IO with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Change this if needed)
    methods: ["GET", "POST"],
  },
});

// ✅ Handle new connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB using Prisma
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB using Prisma!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}
connectDB();

// ✅ API Routes
app.use("/api", tableRoute);
app.use("/orders", orderRoute);
app.use("/superadmin", adminRoute);
app.use("/menu", menuRoute);
app.use("/uploads", express.static("uploads"));
app.use("/users", userRoute);
app.use("/notifications", notificationRoute);
app.use("/dashboard-metrics", dashboardRoute);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Hello from Node.js backend with Prisma & WebSockets!");
});

const PORT = process.env.PORT || 5000;

// ✅ Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app, io, server }; // ✅ Export io so other files can use it
