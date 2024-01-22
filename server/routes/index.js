import express from "express";

import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js";
import jobRoute from "./jobsRoutes.js";
import multer from "multer";

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}users`, userRoute);
router.use(`${path}companies`, companyRoute);
router.use(`${path}jobs`, jobRoute);

// //configuration for multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//        cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//        cb(null, file.originalname);
//     }
//   });
//   const upload = multer({ dest: 'uploads/' });
//   router.post(`${path}upload-cv`, upload.single('file'), async (req, res) => {
//     console.log(req)
//   });

export default router;
