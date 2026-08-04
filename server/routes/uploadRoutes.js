import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { uploadGuests } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/:sessionId",
  protect,
  authorize("admin", "reception"),
  upload.single("file"),
  uploadGuests
);

export default router;