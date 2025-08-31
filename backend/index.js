import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";  
import http from "http";  
import prisma from "./prismaClient.js";
import userRoute from "./routes/userRoute.js"; 
import adminRoute from "./routes/adminRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import tableRoute from "./routes/tableRoute.js";
import orderRoute from "./routes/orderRoute.js";
import menuRoute from "./routes/menuRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Change this if needed)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

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

app.use("/api", tableRoute);
app.use("/orders", orderRoute);
app.use("/superadmin", adminRoute);
app.use("/menu", menuRoute);
app.use("/users", userRoute);
app.use("/notifications", notificationRoute);
app.use("/dashboard-metrics", dashboardRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello from Node.js backend with Prisma & WebSockets!");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app, io, server }; 
