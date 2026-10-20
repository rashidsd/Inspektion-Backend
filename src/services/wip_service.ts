import { QueryTypes } from "sequelize";
import sequelize from "../database/db_config";
import Wip from "../models/wip";
import dayjs from "dayjs";

type WipData = {
  id?: number;
  brand?: string;
  vendor?: string;
  po_no?: string;
  po_date?: Date;
  style_name?: string;
  units_order?: number;
  material_order_date?: Date;
  material_inhouse_date?: Date;
  sample_start_date?: Date;
  sample_send_date?: Date;
  sample_approval_date?: Date;
  production_start_date?: Date;
  top_send_date?: Date;
  off_line_date?: Date;
  finish_packing_date: Date;
  qa_complete_date?: Date;
  estimated_xfactory_date?: Date;
  units_per_day?: number;
  completed_units_as_per_date?: number;
  vendor_remarks?: string;
  client_remarks?: string;
  shiped_qty?: number;
  client_id?: string;
  vendor_id?: string;
  dated: string;
  approved_xfactory_date?: Date;
};

class WipService {
  static async createWip(data: WipData[]) {
    const wipData = data.map((item: any) => {
      {
        delete item.id;
        return item;
      }
    });
    const t = await sequelize.transaction();
    const promises: any = [];
    try {
      for (const item of wipData) {
        const found = await Wip.findOne({
          where: {
            client_id: item.client_id,
            vendor_id: item.vendor_id,
            po_no: item.po_no,
            style_name: item.style_name,
            dated: dayjs(new Date(item.dated)).toISOString(),
          },
          transaction: t,
        });
        if (!found) {
          promises.push(Wip.create(item, { transaction: t }));
        } else {
          promises.push(
            Wip.update(item, {
              where: {
                client_id: item.client_id,
                vendor_id: item.vendor_id,
                po_no: item.po_no,
                style_name: item.style_name,
                dated: dayjs(new Date(item.dated)).toISOString(),
              },
              transaction: t,
            })
          );
        }
      }
      await Promise.all(promises);
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async getVendorWip(client_id: string, vendor_id: string) {
    try {
      const response = await sequelize.query(
        `select row_number() over (order by client_id,vendor_id,po_no,style_name)id,client_id,vendor_id,brand,vendor,po_no,po_date,style_name,units_order,material_order_date,material_inhouse_date,sample_start_date,sample_send_date,sample_approval_date ,production_start_date,completed_units_as_per_date,units_per_day,top_send_date,off_line_date,qa_complete_date,finish_packing_date,approved_xfactory_date,estimated_xfactory_date,ship.shiped_qty,ship.shiped_amount,'' as remarks,'' as dated from vwip_data wip left join vship_data_for_wip ship on po_no=ship_po_no and style_name=ship_style_name and vendor_id=ship_vendor_id AND client_id=ship_client_id where client_id=:client_id ${
          vendor_id != "All" ? "and vendor_id=:vendor_id" : ""
        }`,
        {
          replacements: { vendor_id, client_id },
          type: QueryTypes.SELECT,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async getClientWip(client_id: string) {
    try {
      const response = await sequelize.query(
        "Select row_number() over(order by client_id,vendor_id,po_no,style_name)id, client_id,vendor_id,brand,vendor,po_no,po_date,sku_number,style_name,hero,units_order,last_save_date,second_last_save_date,first_save_date,material_order_date,s_material_order_date,material_diff,f_material_order_date,material_diff_first,material_inhouse_date,s_material_inhouse_date,material_inhouse_diff,f_material_inhouse_date,material_inhouse_diff_first,sample_start_date,s_sample_start_date,sample_start_date_diff,f_sample_start_date,sample_start_date_diff_first,sample_send_date,s_sample_send_date,sample_send_date_diff,f_sample_send_date,sample_send_date_diff_first,sample_approval_date,s_sample_approval_date,sample_approval_date_diff,f_sample_approval_date,sample_approval_date_diff_first,production_start_date,s_production_start_date,production_start_date_diff,f_production_start_date,production_start_date_diff_first,top_send_date,s_top_send_date,top_send_date_diff,f_top_send_date,top_send_date_diff_first,off_line_date,s_off_line_date,off_line_date_diff,f_off_line_date,off_line_date_diff_first,qa_complete_date,s_qa_complete_date,qa_complete_date_diff,f_qa_complete_date,qa_complete_date_diff_first,finish_packing_date,s_finish_packing_date,finish_packing_date_diff,f_finish_packing_date,finish_packing_date_diff_first,approved_xfactory_date,estimated_xfactory_date,s_estimated_xfactory_date,estimated_xfactory_date_diff,ship_date_diff,units_per_day,completed_units_as_per_date,ship_type,vendor_remarks,client_remarks,shiped_qty_real,shiped_amount,units_order_inhand from vwip_data_with_first left join (select concat(p.art_name,' ',a.color) style_names_sku,left(a.barcode,8)sku_number from parent_articles p left join articles a on p.id=a.parent_id)sku on sku.style_names_sku=vwip_data_with_first.style_name where client_id=:client_id AND ( units_order_inhand > 0  or units_order_inhand is null) order by client_id,vendor_id,po_no,style_name",
        {
          replacements: { client_id },
          type: QueryTypes.SELECT,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default WipService;
