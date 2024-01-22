import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  getUser,
  updateUser,
  getUserApplications,
} from "../controllers/userController.js";
import Users from "../models/userModel.js";

const router = express.Router();

// GET user
router.post("/get-user", userAuth, getUser);

router.get("/get-user-applications", userAuth, getUserApplications);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

export default router;
