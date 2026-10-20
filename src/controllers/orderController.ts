import { Request, Response } from "express";
import OrderService from "../services/order_service";
import CustomerService from "../services/client_service";
import ArticleService from "../services/article_service";
import VendorService from "../services/vendor_service";
import ShipDataService from "../services/ship_Data_service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const articles = await ArticleService.invalidArticles(
      req.body.order_detail,
      req.body.client_id
    );
    const customer = await CustomerService.findById(req.body.client_id);
    const vendor = await VendorService.findById(req.body.vendor_id);
    if (customer == null) {
      res.status(400).send({ status: true, msg: "invlid customer" });
    }
    if (vendor == null) {
      res.status(400).send({ status: true, msg: "invlid vendor" });
    } else if (articles.length > 0) {
      res.status(400).send({
        status: true,
        msg: "one or more articles are invalid",
        data: articles,
      });
    } else {
      const response = await OrderService.createOrder({ ...req.body });
      res.send({ status: true, msg: "created", data: response });
    }
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allOrders = async (req: Request, res: Response) => {
  try {
    const response = await OrderService.allOrders();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allOrdersWithDateRange = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.params;

    const response = await OrderService.allOrdersWithDateRange(
      fromDate,
      toDate
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allOrdersWithDateRangeByClient = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate, client_id } = req.params;

    const response = await OrderService.allOrdersWithDateRangeByClient(
      client_id,
      fromDate,
      toDate
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const response = await OrderService.findById(req.params.id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findByIdWithShipped = async (req: Request, res: Response) => {
  try {
    const response = await OrderService.findByIdWithShipped(req.params.id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  try {
    const response = await OrderService.updateOrder({ ...req.body });
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    
    const id = req.params.id;
    const isShipped = await ShipDataService.isOrderShipped(id);
    if (isShipped) {
      res.send({ status: false, msg: "Order has been shipped and cannot be deleted" });
      return;
    }
    const response = await OrderService.deleteOrder(id);
    res.send({ status: true, msg: "deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

//--------------------------------------------- detail record.......................

const addDetailRecord = async (req: Request, res: Response) => {
  try {
    const order: any = await OrderService.findById(req.body.order_no);
    var invalid_articles = [];
    if (order) {
      invalid_articles = await ArticleService.invalidArticles(
        [{ ...req.body }],
        order.custid
      );
    }
    if (!order) {
      res.send({ status: true, msg: "Invlid order no" });
    } else if (invalid_articles?.length > 0) {
      res.send({ status: true, msg: "invalid article" });
    } else {
      const response = OrderService.addDetailRecord({ ...req.body });
      res.send({ status: true, msg: "created", data: response });
    }
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const updateDetailRecord = async (req: Request, res: Response) => {
  try {
    const response = OrderService.updateDetailRecord({ ...req.body });
    res.send({ status: true, msg: "record updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { order_no, status } = req.body;
    const response = OrderService.updateOrderStatus(order_no, status);
    res.send({ status: true, msg: "Order Status updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const deleteDetailRecord = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const response = await OrderService.deleteDetailRecord(id);
    res.send({ status: true, msg: "deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const uploadOrder = async (req: Request, res: Response) => {
  try {
    const response = await OrderService.uploadOrder(req.body);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

export default {
  allOrders,
  findById,
  updateOrder,
  createOrder,
  deleteOrder,
  addDetailRecord,
  updateDetailRecord,
  deleteDetailRecord,
  uploadOrder,
  allOrdersWithDateRange,
  updateOrderStatus,
  allOrdersWithDateRangeByClient,
  findByIdWithShipped,
};
