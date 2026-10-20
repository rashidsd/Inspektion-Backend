import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Set up multer storage configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.resolve(), "public/uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

// Create the multer instance

const upload = multer({ storage: storage });
const uploadSingleFile = upload.single("file");

export default uploadSingleFile;
