import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Set up multer storage configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.resolve(), "public/order_images/"));
  },
  filename: (req, file, cb) => {
    // cb(null, uuidv4() + path.extname(file.originalname));
    cb(null, uuidv4() + ".jpeg");
  },
});

// Create the multer instance
const upload = multer({ storage: storage });
const uploadInspectionImage = upload.single("file");

export default uploadInspectionImage;
