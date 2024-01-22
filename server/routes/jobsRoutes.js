import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  addJobApplication,
  createJob,
  deleteJobPost,
  getApplications,
  getJobById,
  getJobPosts,
  updateJob,
  updateJobApplication
} from "../controllers/jobController.js";

const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// POST job Application
router.post("/job-application", addJobApplication);
router.put("/update-application", updateJobApplication);

// IPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

//GET APPLICATIONS
router.get("/applications", getApplications);

export default router;
