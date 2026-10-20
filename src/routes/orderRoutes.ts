import orderController from "../controllers/orderController";
import express from "express";

const router = express.Router();

router.post("/", orderController.createOrder);
router.post("/uploadOrder", orderController.uploadOrder);
router.get("/:fromDate/:toDate", orderController.allOrdersWithDateRange);
router.get("/orderList/shipped/:id", orderController.findByIdWithShipped);
router.get(
  "/:client_id/:fromDate/:toDate",
  orderController.allOrdersWithDateRange
);
router.get("/", orderController.allOrders);
router.get("/:id", orderController.findById);
router.put("/", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.post("/detail", orderController.addDetailRecord);
router.put("/detail", orderController.updateDetailRecord);
router.put("/orderStatus", orderController.updateOrderStatus);
router.delete("/detail/:id", orderController.deleteDetailRecord);

export default router;
