import path from "path";
import fs from "fs";
import { QueryTypes, Transaction } from "sequelize";
import sequelize from "../database/db_config";
import Vendor from "../models/vendor";
import Vendor_Contact from "../models/vendor_contacts";

import settings from "../settings";

const fileUrl =
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.FILE_UPLOAD_URL
    : settings.PRODUCTION_SERVER.FILE_UPLOAD_URL;

type contact = {
  id?: number; //must be provided in case of update
  vendor_id?: string;
  contact_person: string;
  designation: string;
  contact_no: string;
  email: string;
  
};

type EntityType = {
  id?: string; //must be provided in case of update
  name: string;
  company: string;
  web?: string;
  address?: string;
  source?: string;
  payment_terms?: string;
  payment_days?: number;
  file_name?: string;
  contacts: contact[];
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Vendor.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class VendorService {
  static createVendor = async (obj: EntityType) => {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);

      obj.id = id[0]?.id;
      await Vendor.create(
        {
          id: obj.id,
          name: obj.name,
          company: obj.company,
          web: obj.web,
          address: obj.address,
          source: obj.source,
          payment_terms: obj.payment_terms,
          payment_days: obj.payment_days,
          file_name: obj.file_name,
        },

        { transaction: t }
      );
      obj.contacts.forEach((contact) => {
        contact.vendor_id = obj.id;
      });

      await Vendor_Contact.bulkCreate(obj.contacts, { transaction: t });
      await t.commit();
      return await Vendor.findByPk(obj.id, {
        include: { model: Vendor_Contact, as: "contacts" },
      });
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  };

  static async allVendors() {
    const response = await Vendor.findAll({
      include: { model: Vendor_Contact, as: "contacts" },
    });

    const vendors = JSON.parse(JSON.stringify(response));
    vendors.forEach((vendor: any) => {
      vendor.url = `${fileUrl}/uploads/${vendor.file_name}`;
    });
    return vendors;
  }

  static async getVendorsForSelection() {
    return await Vendor.findAll({
      attributes: ["id", "name"],
    });
  }

  static async findById(id: string) {
    const response: any = await Vendor.findByPk(id, {
      include: { model: Vendor_Contact, as: "contacts" },
    });
    const vendor = JSON.parse(JSON.stringify(response));
    vendor.url = `${fileUrl}/uploads/${response.file_name}`;
    return vendor;
  }

  static async findByName(name: string) {
    return await Vendor.findAll({ where: { name } });
  }

  static async deleteVendor(id: string) {
    const found: any = await Vendor.findByPk(id, {
      include: { model: Vendor_Contact, as: "contacts" },
    });
    if (found) {
      const filePath: any = path.join(
        path.resolve(),
        `public/uploads/${found.file_name}`
      );

      fs.unlink(filePath, async (error) => {
        if (error) {
          console.log(error);
        } else {
          await Vendor.destroy({ where: { id } });
          return found;
        }
      });
    }
    return found;
  }

  static async updateVendor(obj: EntityType) {
    const found = await Vendor.findByPk(obj.id);
    if (found) {
      await found.update({
        web: obj.web,
        address: obj.web,
        source: obj.source,
        payment_terms: obj.payment_terms,
        payment_days: obj.payment_days,
        file_name: obj.file_name,
      });
      await found.save();

      await Vendor_Contact.bulkCreate(obj.contacts, {
        updateOnDuplicate: [
          "id",
          "vendor_id",
          "contact_person",
          "designation",
          "contact_no",
          "email",
        ],
      });
      const result = await Vendor.findByPk(obj.id, {
        include: { model: Vendor_Contact, as: "contacts" },
      });
      return result;
    }
  }

  //------------------------- vendor contact----------------------------

  static async addVendorContact(obj: contact) {
    return await Vendor.create({ ...obj });
  }

  static async deleteVendorContact(id: number) {
    const found = await Vendor_Contact.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return found;
  }

  static async vendorContactsById(clientId: string) {
    return await Vendor.findAll({ where: { client_id: clientId } });
  }

  static updateVendorContact = async (obj: contact) => {
    const found = await Vendor_Contact.findByPk(obj.id);
    if (found) {
      await found.update({
        contact_person: obj.contact_person,
        designation: obj.designation,
        contact_no: obj.contact_no,
        email: obj.email,
      });
      await found.save();
      return found;
    }
  };
}

export default VendorService;
