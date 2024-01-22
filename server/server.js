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
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8800;

// MONGODB CONNECTION
dbConnection();

// middlename
app.use(express.static("public"));
// app.use(cors());
const corsOptions = {
  origin: /\.onrender\.com$/,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://workease-bese27c.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

//configuration for multer
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
app.use(router);

//error middleware
app.use(errorMiddleware);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Key, Access-Control-Allow-Origin"
  );
  next();
});
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
