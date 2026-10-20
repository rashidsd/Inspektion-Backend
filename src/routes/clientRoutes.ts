import clientController from "../controllers/clientController";
import express from "express";
import upload_file from "../middleWares/upload_file";
import process_upload_single_file from "../middleWares/process_upload_single_file";

const router = express.Router();

router.post(
  "/",
  upload_file,
  process_upload_single_file,
  clientController.createClient
);
router.get("/", clientController.allClients);
router.get("/clientForSelection", clientController.getClientsForSelection);
router.get("/:id", clientController.findById);
router.delete("/:id", clientController.deleteClient);
router.put(
  "/",
  upload_file,
  process_upload_single_file,
  clientController.updateClient
);
router.post("/contact", clientController.addClientContact);
router.put("/contact", clientController.updateClientContact);
router.delete("/contact/:id", clientController.deleteClientContact);
router.get(
  "/contact/clientcontacts/:clientId",
  clientController.clientContactsById
);
router.post("/brand", clientController.addClientBrand);
router.put("/brand", clientController.updateClientBrand);
router.delete("/brand/:id", clientController.deleteClientBrand);

export default router;
