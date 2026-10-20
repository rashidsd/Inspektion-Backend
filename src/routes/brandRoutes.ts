import brandController from "../controllers/brandController";
import express from "express";
const router = express.Router();

router.post("/", brandController.createBrand); // Create a new brand
router.get("/", brandController.allBrands); // Retrieve all brands
router.put("/", brandController.updateBrand); // Update a brand with id
router.get("/:id", brandController.findById); // Retrieve a single brand with id
router.get("/client/:clientId", brandController.brandByClient); // Retrieve a single brand with id
router.delete("/:id", brandController.deleteBrand); // Delete a brand with id

export default router;
