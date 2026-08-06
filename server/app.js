import express from "express";
import cors from "cors";

import sessionRoutes from "./routes/sessionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import unassignedRoutes from "./routes/unassignedRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/unassigned", unassignedRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "Hotel Buffet Tracker API Running",
  });
});

export default app;