import { Where } from "sequelize/types/utils";
import sequelize from "../database/db_config";
import ShipData from "../models/ship_data";
import { col, fn, QueryTypes,where } from "sequelize";

type ShipDataType = {
  id: number;
  client_id: string;
  vendor_id: string;
  order_no: string;
  client_order_no: string;
  article_id: string;
  color: string;
  size: string;
  qty: number;
  price: number;
  amount: number;
  ship_type: string;
  ship_no: string;
  ship_Date: Date;
  block_no?: string;
  bl_date?: string;
};

class ShipDataService {
  static async create(data: ShipDataType[]) {
    try {
      return await ShipData.bulkCreate(data);
    } catch (error) {
      console.error(error);
    }
  }

  static async findAll(fromDate: string, toDate: string) {
    try {
      return await sequelize.query(
        "select s.id,s.client_id,c.name as client,s.vendor_id,v.name as vendor,order_no, client_order_no,s.article_id,a.art_name,s.color,s.size,qty,s.price,amount,ship_type,ship_no,ship_date,remarks,bl_no,bl_date from ship_data s left join articles a on s.article_id=a.id left join clients c on s.client_id=c.id left join vendors v on s.vendor_id=v.id where s.ship_date between :fromDate and :toDate",
        {
          replacements: { fromDate, toDate },
          type: QueryTypes.SELECT,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async findAllByClientAndVender(client_id: string, vendor_id: string) {
    try {
      return await sequelize.query(
        "select s.id,s.client_id,c.name as client,s.vendor_id,v.name as vendor,order_no, client_order_no,s.article_id,a.art_name,s.color,s.size,qty,s.price,amount,ship_type,ship_no,ship_date,remarks,bl_no,bl_date from ship_data s left join articles a on s.article_id=a.id left join clients c on s.client_id=c.id left join vendors v on s.vendor_id=v.id where s.client_id=:client_id and s.vendor_id=:vendor_id",
        {
          replacements: { client_id, vendor_id },
          type: QueryTypes.SELECT,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async findAllByClient(
    client_id: string,
    fromDate: string,
    toDate: string,
    openClose: boolean
  ) {
    try {
      return await sequelize.query(
        "select s.id,s.client_id,c.name as client,s.vendor_id,v.name as vendor,s.order_no, s.client_order_no,b.name as brand,a.barcode,s.article_id,a.art_name,s.color,s.size,qty,s.price,amount,s.ship_type,s.ship_no,s.ship_date,o.ship_date as approved_ship_date,s.remarks,s.bl_no,s.bl_date,s.id,coalesce(s.is_close,false)is_close from ship_data s left join articles a on s.article_id=a.id left join clients c on s.client_id=c.id left join vendors v on s.vendor_id=v.id left join order_master o on s.order_no=o.order_no left join brands b on a.brand_id=b.id where s.client_id=:client_id AND s.is_close=:openClose AND s.ship_date between :fromDate and :toDate",
        {
          replacements: { client_id, fromDate, toDate, openClose },
          type: QueryTypes.SELECT,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async articleSelectionForShipData(order_no: string) {
    try {
      return await sequelize.query(
        "select order_no,article_id,a.art_name,color,size,barcode,qty,d.price,coalesce(ship_qty,0)ship_qty,qty-coalesce(ship_qty,0)bal,0 as shipping  from order_detail d left join articles a on d.article_id=a.id left join (Select order_no as s_order_no,client_order_no,article_id as s_article_id,sum(qty)ship_qty from ship_data group by order_no,client_order_no,article_id ) as ship on order_no=s_order_no AND article_id=s_article_id where order_no=:order_no",
        {
          replacements: { order_no },
          type: QueryTypes.SELECT,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  static async updateBlNoAndDate(shipNo:string,blNo?:string,blDate?:string){
    try {
     shipNo=shipNo.trim();
      return await ShipData.update({bl_no:blNo,bl_date:blDate},{
        where: where(fn('LOWER',col('ship_no')), shipNo.toLowerCase())
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async updateRemarks(id:number,remarks?:string){
    try {
      return await ShipData.update({remarks},{
        where: {id}
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updatePaymentStatusAndRemarks(fieldName:string,fieldValue:any,shipNo: string) {
    try {
      
      if (fieldName==="payment_status") {
        
         await sequelize.query(`UPDATE ship_data SET payment_status = :fieldValue WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
          replacements: { fieldValue, shipNo },
          type: QueryTypes.UPDATE,
        });
      }else if (fieldName==="payment_remarks") {
         await sequelize.query(`UPDATE ship_data SET payment_remarks = :fieldValue WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
          replacements: { fieldValue, shipNo },
          type: QueryTypes.UPDATE,
        });
      }else if (fieldName==="reminder_date") {
         await sequelize.query(`UPDATE ship_data SET reminder_date = :fieldValue WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
          replacements: { fieldValue: fieldValue || null, shipNo },
          type: QueryTypes.UPDATE,
        });
      } else {
        throw new Error(`Invalid field name: ${fieldName}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Error updating payment status and remarks: ${error}`);
    }
  }

  static async updateShipField(shipNo: string, field: string, value: string | null) {
    try {
      shipNo = shipNo.trim();
      if (field === "bl_no") {
        return await sequelize.query(`UPDATE ship_data SET bl_no = :value WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
          replacements: { value: value || null, shipNo },
          type: QueryTypes.UPDATE,
        });
      } else if (field === "bl_date") {
        return await sequelize.query(`UPDATE ship_data SET bl_date = :value WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
          replacements: { value: value || null, shipNo },
          type: QueryTypes.UPDATE,
        });
      } else {
        throw new Error(`Invalid field name: ${field}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      return await ShipData.destroy({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }

  static async paymentData(client_id: string,fromDate:string,toDate:string,close:boolean) {
    try {
      const qry = `with cte as (
select vendor_id,client_id ,ship_type,ship_no as invoice_no,ship_date as invoice_date,('documents')::text as documents,bl_no,bl_date,sum(amount)total_amount,
payment_status,max(remarks) as remarks,
string_agg(DISTINCT client_order_no, ',') as po_nos,
reminder_date,coalesce(is_close,false)is_close from ship_data group by client_id,vendor_id,ship_type,ship_no,ship_date,bl_no,bl_date,payment_status,reminder_date,is_close
),
due as (
select cte.*,v.name as vendor,v.payment_days,v.source,
case when cte.bl_date is not null then (cte.bl_date + (coalesce(v.payment_days,0) || ' days')::interval)::date else null end as due_date
from cte left join vendors v on cte.vendor_id=v.id
)
select client_id,vendor_id,vendor,ship_type,invoice_no,invoice_date,documents,bl_no,bl_date,po_nos,total_amount,payment_days,source,due_date,
coalesce(reminder_date, due_date - 3) as reminder_date,
payment_status,remarks as payment_remarks,is_close
from due where client_id=:client_id and invoice_date between :fromDate and :toDate and is_close=:close order by invoice_no`;
const response= await sequelize.query(qry, {
        replacements: { client_id, fromDate, toDate, close },
        type: QueryTypes.SELECT,
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new Error(`Error fetching payment data: ${error}`);
    }
  }

static async updateShipDataByShipNo(
  shipNo: string,
  editShipNo: string,
  ship_date: string | null,
  bl_no: string | null,
  bl_date: string | null,
  is_close: boolean
) {
  try {
    shipNo = shipNo.trim();
    editShipNo = editShipNo.trim();
    bl_no = bl_no?.trim() || null;
    bl_date = bl_date ? bl_date : null;
    ship_date = ship_date ? ship_date : null;

   
    if (bl_date !== 'Invalid Date' && bl_date !== null) {
      return await sequelize.query(`UPDATE ship_data SET ship_no = :editShipNo, ship_date = :ship_date, bl_no = :bl_no, bl_date = :bl_date WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
        replacements: { editShipNo, ship_date, bl_no, bl_date, shipNo },
        type: QueryTypes.UPDATE,
      });
    } else {
      return await sequelize.query(`UPDATE ship_data SET ship_no = :editShipNo, ship_date = :ship_date, bl_no = :bl_no WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
        replacements: { editShipNo, ship_date, bl_no, shipNo },
        type: QueryTypes.UPDATE,
      });
    }
   
  } catch (error) {
    console.error(error);
    throw error;
  }
}
static async changeShipmentStatus(shipNo: string, is_close: boolean) {
  try {
   console.log('shipNo:',shipNo,'is_close:',is_close);
    shipNo = shipNo.trim();
    return await sequelize.query(`UPDATE ship_data SET is_close = :is_close WHERE LOWER(ship_no) = LOWER(:shipNo)`, {
      replacements: { shipNo, is_close },
      type: QueryTypes.UPDATE,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }   

}

static async isOrderShipped(order_no: string) {
  try {
    const response = await sequelize.query(
      "select count(*)cnt from ship_data where order_no=:order_no",
      {
        replacements: { order_no },
        type: QueryTypes.SELECT,
        plain: true,
      }
    );
    const count = parseInt((response as any).cnt, 10);
    return count > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

}
export default ShipDataService;
