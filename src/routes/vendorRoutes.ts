import vendorController from "../controllers/vendorController";
import upload_file from "../middleWares/upload_file";
import process_upload_single_file from "../middleWares/process_upload_single_file";

import express from "express";

const router = express.Router();

router.post(
  "/",
  upload_file,
  process_upload_single_file,
  vendorController.createVendor
);
router.get("/", vendorController.allVendors);
router.get("/vendorForSelection", vendorController.getVendorsForSelection);
router.get("/:id", vendorController.findById);
router.delete("/:id", vendorController.deleteVendor);
router.put(
  "/",
  upload_file,
  process_upload_single_file,
  vendorController.updateVendor
);

router.post("/contact", vendorController.addVendorContact);
router.put("/contact", vendorController.updateVendorContact);
router.delete("/contact/:id", vendorController.deleteVendorContact);
router.get(
  "/contact/vendorcontacts/:vendorId",
  vendorController.vendorContactsById
);

export default router;
