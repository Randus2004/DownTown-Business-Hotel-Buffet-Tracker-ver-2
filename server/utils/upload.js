import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed =
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype ===
      "application/vnd.ms-excel";

  if (allowed) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed."));
  }
};

export default multer({
  storage,
  fileFilter,
});