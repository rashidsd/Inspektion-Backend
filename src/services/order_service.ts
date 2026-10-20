import OrderMaster from "../models/order_master";
import { Transaction, QueryTypes, or } from "sequelize";
import sequelize from "../database/db_config";
import OrderDetail from "../models/order_detail";

type orderDetailType = {
  id?: number;
  order_no?: string;
  article_id: string;
  size: string;
  qty: number;
  price: number;
  total: number;
};

type uploadDetailType = {
  barcode: string;
  qty: number;
  price: number;
};

type uploadOrderType = {
  client_id: string;
  detail: uploadDetailType[];
};

type orderType = {
  order_no?: string;
  dated: Date;
  ship_date: Date;
  client_id: string;
  client_order_no: string;
  vendor_id: string;
  vendor_order_no?: string;
  remarks?: string;
  ship_type: string;
  ship_country: string;
  ship_address: string;
  reference: string;
  close?: boolean;

  order_detail: orderDetailType[];
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(order_no as int)),0)+1,'0000')) as id from ${OrderMaster.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class OrderService {
  static async createOrder(obj: orderType) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      obj.order_no = id[0]?.id;
      await OrderMaster.create(
        {
          ...obj,
        },
        { transaction: t }
      );

      const promises: any[] = [];
      for (const detail of obj.order_detail) {
        detail.order_no = obj.order_no;

        const found = await OrderDetail.findOne({
          where: { id: detail.id },
          transaction: t,
        });
        if (found) {
          promises.push(found.update({ ...detail }, { transaction: t }));
        } else {
          const { id, ...rest } = detail;
          promises.push(OrderDetail.create({ ...rest }, { transaction: t }));
        }
      }
      await Promise.all(promises);
      await t.commit();
      return { order_no: obj.order_no };
    } catch (error) {
      console.log(error);
    }
  }

  static async allOrders() {
    try {
      return await sequelize.query(
        "select order_no,dated,ship_date,client_id,c.name as client_name,vendor_id,v.name as vendor_name,client_order_no,vendor_order_no,ship_type,ship_country,ship_address,reference,remarks from order_master m left join clients c on m.client_id = c.id left join vendors v on m.vendor_id = v.id ",
        { type: QueryTypes.SELECT }
      );
    } catch (error: any) {
      throw new Error("Error fetching all orders: " + error.message);
    }
  }

  static async allOrdersWithDateRange(fromDate: string, toDate: string) {
    try {
      return await sequelize.query(
        "select order_no,dated,ship_date,client_id,c.name as client_name,vendor_id,v.name as vendor_name,client_order_no,vendor_order_no,ship_type,ship_country,ship_address,reference,remarks,m.close from order_master m left join clients c on m.client_id = c.id left join vendors v on m.vendor_id = v.id where m.dated between :fromDate AND :toDate",

        { replacements: { fromDate, toDate }, type: QueryTypes.SELECT }
      );
    } catch (error: any) {
      throw new Error(
        "Error fetching all orders with date range: " + error.message
      );
    }
  }
  static async allOrdersWithDateRangeByClient(
    client_id: string,
    fromDate: string,
    toDate: string
  ) {
    try {
      return await sequelize.query(
        "select order_no,dated,ship_date,client_id,c.name as client_name,vendor_id,v.name as vendor_name,client_order_no,vendor_order_no,ship_type,ship_country,ship_address,reference,remarks,m.close from order_master m left join clients c on m.client_id = c.id left join vendors v on m.vendor_id = v.id where m.dated between :fromDate AND :toDate",

        { replacements: { fromDate, toDate }, type: QueryTypes.SELECT }
      );
    } catch (error: any) {
      throw new Error(
        "Error fetching all orders with date range: " + error.message
      );
    }
  }

  static async findById(order_no: string) {
    try {
      const master: any = await sequelize.query(
        "select order_no,dated,ship_date,client_id,c.name as client_name,vendor_id,v.name as vendor_name,client_order_no,vendor_order_no,ship_type,ship_country,ship_address,reference,remarks from order_master m left join clients c on m.client_id = c.id left join vendors v on m.vendor_id = v.id where m.order_no=:order_no",
        { replacements: { order_no }, type: QueryTypes.SELECT, plain: true }
      );

      const detail = await sequelize.query(
        "select d.id,order_no,article_id,a.art_no,a.art_name,a.color,size,a.barcode,qty,d.price,total from order_detail d left join articles a on d.article_id = a.id where d.order_no =:order_no",
        { replacements: { order_no }, type: QueryTypes.SELECT }
      );

      master.order_detail = detail;
      return master;
    } catch (error: any) {
      throw new Error("Error fetching order by ID: " + error.message);
    }
  }

  static async findByIdWithShipped(order_no: string) {
    try {
      const master: any = await sequelize.query(
        "select order_no,dated,ship_date,client_id,c.name as client_name,vendor_id,v.name as vendor_name,client_order_no,vendor_order_no,ship_type,ship_country,ship_address,reference,remarks from order_master m left join clients c on m.client_id = c.id left join vendors v on m.vendor_id = v.id where m.order_no=:order_no",
        { replacements: { order_no }, type: QueryTypes.SELECT, plain: true }
      );

      const detail = await sequelize.query(
        "select d.id,d.order_no,d.article_id,a.art_no,a.art_name,a.color,size,a.barcode,qty,d.price,total,coalesce(qty,0)-coalesce(shipped,0)bal,(coalesce(qty,0)-coalesce(shipped,0)) * d.price as bal_amount, coalesce(shipped,0)shiped,coalesce(shipped_amount,0)shipped_amount from order_detail d left join articles a on d.article_id = a.id Left join (select order_no,article_id,sum(qty)shipped,sum(amount)shipped_amount from ship_data group by order_no,article_id)ship on d.order_no=ship.order_no and d.article_id=ship.article_id where d.order_no =:order_no",
        { replacements: { order_no }, type: QueryTypes.SELECT }
      );

      master.order_detail = detail;
      return master;
    } catch (error: any) {
      throw new Error("Error fetching order by ID: " + error.message);
    }
  }

  static async updateOrder(obj: orderType) {
    try {
      obj.order_detail.forEach((o) => {
        o.order_no = obj.order_no;
      });
      const t = await sequelize.transaction();
      const found = await OrderMaster.findByPk(obj.order_no, {
        transaction: t,
      });
      const { client_id, vendor_id, client_order_no, order_detail, ...rest } =
        obj;

      if (found) {
        await found.update({ ...rest }, { transaction: t });
      }

      const promises: any[] = [];

      for (const detail of obj.order_detail) {
        detail.order_no = obj.order_no;

        const found = await OrderDetail.findOne({
          where: { id: detail.id ? Number(detail.id) : -1 },
          transaction: t,
        });
        if (found) {
          promises.push(found.update({ ...detail }, { transaction: t }));
        } else {
          const { id, ...rest } = detail;
          promises.push(OrderDetail.create({ ...rest }, { transaction: t }));
        }
      }
      await Promise.all(promises);
      await t.commit();
      return { order_no: obj.order_no };
    } catch (error) {
      console.log(error);
    }
  }

  // static async updateOrder(obj: orderType) {
  //   obj.order_detail.forEach((o) => {
  //     o.order_no = obj.order_no;
  //   });

  //   const found = await OrderMaster.findByPk(obj.order_no);
  //   const t = await sequelize.transaction();

  //   const { order_no, ...rest } = obj;
  //   if (found) {
  //     await found.update({ ...rest }, { transaction: t });
  //     await found.save();
  //     if (obj.order_detail) {
  //       await OrderDetail.bulkCreate(obj.order_detail, {
  //         transaction: t,
  //         updateOnDuplicate: [
  //           "id",
  //           "order_no",
  //           "article_id",
  //           "qty",
  //           "price",
  //           "amount",
  //           "total",
  //         ],
  //       });
  //     }
  //     await t.commit();
  //     return await this.findById(obj.order_no as string);
  //   }
  //   return found;
  // }

  static deleteOrder = async (id: string) => {
    try {
      const t = await sequelize.transaction();
      await OrderDetail.destroy({ where: { order_no: id }, transaction: t });
      const found = await OrderMaster.findByPk(id, { transaction: t });
      if (found) {
        await found.destroy({ transaction: t });
      }
      await t.commit();
      return found;
    } catch (error) {
      console.log(error);
    }
  };

  static async findByClient(client_id: string) {
    try {
      const response: any = await OrderMaster.findAll({ where: { client_id } });
      return response?.length ? true : false;
    } catch (error) {
      console.log(error);
    }
  }

  static async findByVendor(vendor_id: string) {
    try {
      const response = await OrderMaster.findAll({ where: { vendor_id } });
      return response?.length ? true : false;
    } catch (error) {
      console.log(error);
    }
  }

  //-------------------------------------------Detail Records-----------------------
  static isArticleInOrder = async (art_id: string) => {
    try {
      const response = await OrderDetail.findOne({
        where: { article_id: art_id },
      });
      return response ? true : false;
    } catch (error) {
      console.log(error);
    }
  };

  static async addDetailRecord(obj: orderDetailType) {
    try {
      return await OrderDetail.create({ ...obj });
    } catch (error) {
      console.log(error);
    }
  }

  static deleteDetailRecord = async (id: number) => {
    try {
      const found = await OrderDetail.findByPk(id);
      if (found) {
        await found.destroy();
      }
      return found;
    } catch (error) {
      console.log(error);
    }
  };

  static updateDetailRecord = async (obj: orderDetailType) => {
    try {
      const found = await OrderDetail.findByPk(obj.id);
      if (found) {
        const { qty, total } = obj;
        await found.update({ qty, total });
        await found.save();
      }
      return found;
    } catch (error) {
      console.log(error);
    }
  };
  static async uploadOrder(order: uploadOrderType) {
    try {
      const articles = await sequelize.query(
        "Select id,art_no,art_name,color,size,barcode from articles where client_id=:client_id ",
        {
          replacements: { client_id: order.client_id },
          type: QueryTypes.SELECT,
        }
      );

      const response = order.detail.map((d: any) => {
        const found: any = articles.find((a: any) => a.barcode == d.barcode);
        if (found) {
          return {
            id: 0,
            article_id: found.id,
            art_no: found.art_no,
            art_name: found.art_name,
            color: found.color,
            size: found.size,
            barcode: d.barcode,
            qty: d.qty,
            price: Number(d.price),
            total: (Number(d.qty) * Number(d.price)).toFixed(2),
            found: 1,
          };
        }
        return {
          id: 0,
          article_id: null,
          art_no: null,
          art_name: null,
          color: null,
          size: null,
          barcode: d.barcode,
          qty: d.qty,
          price: d.price,
          total: 0,
          found: 0,
        };
      });

      const found = response.filter((r: any) => r.found === 1);
      const notFound = response.filter((r: any) => r.found === 0);
      return { found, notFound };
    } catch (error) {
      console.log(error);
    }
  }

  static async updateOrderStatus(order_no: string, status: boolean) {
    const found = await OrderMaster.findByPk(order_no);
    if (found) {
      await found.update({ close: status });
      await found.save();
    }
    return found;
  }
}

export default OrderService;
