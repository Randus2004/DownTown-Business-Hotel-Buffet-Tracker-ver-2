import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user,
  });
});

export default router;