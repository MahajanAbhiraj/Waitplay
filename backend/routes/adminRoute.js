import express from "express";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = "your_jwt_secret_key";
const prisma = new PrismaClient();
const router = express.Router();

// Get all admins
router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      include: {
        restaurant: {
          select: { name: true, location: true },
        },
      },
    });
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins", error });
  }
});

// Update an admin
router.patch("/:id", async (req, res) => {
  const adminId = req.params.id;
  const updates = req.body;
  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: updates,
    });
    res.status(200).json({
      message: "Admin details updated successfully.",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
});

// Create an admin and associated restaurant
router.post("/", async (req, res) => {
  const { name, email, phoneNumber, password, location, restaurant_name, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role !== "superadmin") {
      const newRestaurant = await prisma.restaurant.create({
        data: { name: restaurant_name, location },
      });

      const newAdmin = await prisma.admin.create({
        data: {
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          location,
          restaurant_name,
          registeredDate: new Date(),
          restaurant_id: newRestaurant.id,
          role,
        },
      });

      res.status(201).json({
        message: "Admin and associated restaurant created successfully",
        admin: newAdmin,
        restaurant: newRestaurant,
      });
    } else {
      const newAdmin = await prisma.admin.create({
        data: {
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          registeredDate: new Date(),
          role,
        },
      });

      res.status(201).json({
        message: "Superadmin created successfully",
        admin: newAdmin,
      });
    }
  } catch (error) {
    console.error("Error creating admin and restaurant:", error);
    res.status(500).json({ message: "Error creating admin and restaurant", error });
  }
});

// Delete a request and create a table
router.delete("/requests/:id", async (req, res) => {
  try {
    const request = await prisma.requests.findUnique({ where: { id: req.params.id } });
    if (!request) return res.status(404).json({ message: "Request not found" });

    const { tableNo, tableDescription, restaurantId } = request;
    const qrCode = `https://example.com?restaurantId=${encodeURIComponent(restaurantId)}&tableId=${encodeURIComponent(tableNo)}`;

    const newTable = await prisma.table.create({
      data: {
        tableId: tableNo,
        description: tableDescription,
        restaurantId,
        qrData: qrCode,
      },
    });

    await prisma.requests.delete({ where: { id: req.params.id } });

    res.status(201).json({
      message: "Table created and added to restaurant successfully",
      table: newTable,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Add a request
router.post("/requests", async (req, res) => {
  const { tableNo, tableDescription, restaurantId, restaurantName } = req.body;
  if (!tableNo || !restaurantId || !restaurantName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const savedRequest = await prisma.requests.create({
      data: { tableNo, tableDescription, restaurantId, restaurantName },
    });

    res.status(201).json({ message: "Request added successfully", request: savedRequest });
  } catch (error) {
    res.status(500).json({ error: "Failed to add request", details: error.message });
  }
});

// Get all requests
router.get("/requests", async (req, res) => {
  try {
    const requests = await prisma.requests.findMany();
    res.status(200).json({ message: "Fetched successfully", requests });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch request", details: error.message });
  }
});

// Get all restaurants
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, location: true },
    });
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching restaurants", error: error.message });
  }
});

// Get a restaurant by ID
router.get("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: req.params.id } });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching restaurant", error: error.message });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password." });

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful.",
      token,
      role: admin.role,
      admin: { id: admin.id, name: admin.name, email: admin.email, restaurant_name: admin.restaurant_name },
      restaurant_id: admin.restaurant_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});

export default router;
