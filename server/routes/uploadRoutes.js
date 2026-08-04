import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadGuests } from "../controllers/uploadController.js";

const router = express.Router();

// Upload Guest Excel
router.post(
  "/:sessionId",
  upload.single("file"),
  uploadGuests
);

export default router;