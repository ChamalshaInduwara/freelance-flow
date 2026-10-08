const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Freelance Flow API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});