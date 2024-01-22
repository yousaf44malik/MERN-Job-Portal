import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  getUser,
  updateUser,
  getUserApplications,
} from "../controllers/userController.js";
import Users from "../models/userModel.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// GET user
router.post("/get-user", userAuth, getUser);

router.get("/get-user-applications", userAuth, getUserApplications);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, req.query.userId ? `${req.query.userId}.pdf` : file.originalname);
  },
});
const upload1 = multer({ storage: storage1 });
app.post(`/upload-cv`, upload1.single("CV"), async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      res.status(400).send("No File Provided");
      return;
    }
    res.status(200).send("CV uploaded successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
