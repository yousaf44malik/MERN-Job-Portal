import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import dbConnection from "./dbConfig/dbConnection.js";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import Corsmiddleware from "./middlewares/Corsmiddleware.js";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    preflightContinue: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: true,
  })
);
const PORT = process.env.PORT || 8800;

// MONGODB CONNECTION
dbConnection();

// middlename
app.use(express.static("public"));
// app.use(
//   cors({
//     origin: "https://workease-bese27c.vercel.app",
//   })
// );

// var whitelist = ["https://workease-bese27c.vercel.app"];
// var corsOptions = {
//   origin: function (origin, callback) {
//     var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
//     callback(null, originIsWhitelisted);
//   },
//   credentials: true,
// };
// app.use(cors(corsOptions));

app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);
app.use(Corsmiddleware);

//configuration for multer
// const storage1 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.query.userId ? `${req.query.userId}.pdf` : file.originalname);
//   },
// });
// const upload1 = multer({ storage: storage1 });
// app.post(`/upload-cv`, upload1.single("CV"), async (req, res) => {
//   console.log(req.file);
//   try {
//     if (!req.file) {
//       res.status(400).send("No File Provided");
//       return;
//     }
//     res.status(200).send("CV uploaded successfully");
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

const __dirname = path.resolve();
app.use("/resources", express.static(path.join(__dirname, "/public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, req.query.fileName); // Use the original file name
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file; // Access the uploaded file
  // console.log(req.query.fileName);
  // Process the file as needed
  res.json({ message: "File uploaded successfully." });
});

app.listen(PORT, () => {
  console.log(`Dev Server running on port: ${PORT}`);
});
