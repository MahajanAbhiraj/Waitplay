import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prismaClient.js";
import userRoute from "./routes/userRoute.js"; 
import adminRoute from "./routes/adminRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import tableRoute from './routes/tableRoute.js';
import orderRoute from './routes/orderRoute.js';
import menuRoute from './routes/menuRoute.js';
import notificationRoute from './routes/notificationRoute.js';

dotenv.config();
const app = express();

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

app.use('/api', tableRoute);
app.use('/orders', orderRoute);
app.use('/superadmin', adminRoute);
app.use('/menu', menuRoute);
app.use("/uploads", express.static("uploads"));
app.use("/users", userRoute);
app.use("/notifications",notificationRoute);
app.use("/dashboard-metrics", dashboardRoute);


app.get("/", (req, res) => {
  res.send("Hello from Node.js backend with Prisma!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
