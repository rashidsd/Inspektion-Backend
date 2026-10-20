import { QueryTypes, Transaction } from "sequelize";
import sequelize from "../database/db_config";
import Client from "../models/client";
import Client_Contact from "../models/client_contact";
import Brand from "../models/brand";
import path from "path";
import fs from "fs";
import settings from "../settings";

const fileUrl =
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.FILE_UPLOAD_URL
    : settings.PRODUCTION_SERVER.FILE_UPLOAD_URL;

type brand = {
  id?: string;
  name: string;
  client_id?: string;
  descr?: string;
};

type contact = {
  id?: number; //must be provided in case of update
  client_id?: string;
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
  file_name?: string;
  url: string;
  contacts: contact[];
  brands: brand[];
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Client.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

const getBarnadId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Brand.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class ClientService {
  static createClient = async (obj: EntityType) => {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);

      obj.id = id[0]?.id;
      await Client.create(
        {
          id: obj.id,
          name: obj.name,
          company: obj.company,
          web: obj.web,
          address: obj.address,
          file_name: obj.file_name,
        },

        { transaction: t }
      );
      obj.contacts.forEach((contact) => {
        contact.client_id = obj.id;
      });

      obj.brands.forEach(async (brand) => {
        brand.client_id = obj.id;
        if (brand.id == undefined || brand.id == "") {
          const id: any = await getBarnadId(t);
          brand.id = id[0]?.id;
        } else {
          brand.id = brand.id;
        }
      });

      await Client_Contact.bulkCreate(obj.contacts, { transaction: t });
      await Brand.bulkCreate(obj.brands, { transaction: t });
      await t.commit();
      return await Client.findByPk(obj.id, {
        include: { model: Client_Contact, as: "contacts" },
      });
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  };

  static async allClients() {
    const response: any = await Client.findAll({
      include: [
        { model: Client_Contact, as: "contacts" },
        { model: Brand, as: "brands" },
      ],
    });
    const clients = JSON.parse(JSON.stringify(response));
    clients.forEach((client: any) => {
      client.url = `${fileUrl}/uploads/${client.file_name}`;
    });
    return clients;
  }

  static async getClientsForSelection() {
    return await Client.findAll({
      attributes: ["id", "name"],
    });
  }

  static async findById(id: string) {
    var response: any = await Client.findByPk(id, {
      include: [
        { model: Client_Contact, as: "contacts" },
        { model: Brand, as: "brands" },
      ],
    });

    const client = JSON.parse(JSON.stringify(response));
    client.url = `${fileUrl}/uploads/${response.file_name}`;
    return client;
  }

  static async findByName(name: string) {
    return await Client.findAll({ where: { name } });
  }

  static async deleteClient(id: string) {
    const found: any = await Client.findByPk(id, {
      include: { model: Client_Contact, as: "contacts" },
    });
    if (found) {
      const filePath = path.join(
        path.resolve(),
        `public/uploads/${found?.file_name}`
      );
      fs.unlink(filePath, async (error) => {
        if (error) {
          console.log(error);
        } else {
          await Client.destroy({ where: { id } });
          return found;
        }
      });
    }
  }

  static async updateClient(obj: EntityType) {
    const t = await sequelize.transaction();

    const found = await Client.findByPk(obj.id, { transaction: t });
    if (found) {
      await found.update(
        {
          web: obj.web,
          address: obj.address,
          file_name: obj.file_name,
        },
        { transaction: t }
      );
      await found.save();

      await Client_Contact.bulkCreate(obj.contacts, {
        updateOnDuplicate: [
          "id",
          "client_id",
          "contact_person",
          "designation",
          "contact_no",
          "email",
        ],
        transaction: t,
      });
      await this.processBrandsAsync(obj.brands, t);

      await t.commit();
      const result = await Client.findByPk(obj.id, {
        include: [
          { model: Client_Contact, as: "contacts" },
          { model: Brand, as: "brands" },
        ],
      });
      return result;
    }
  }

  //------------------------- client contact----------------------------

  static async addClientContact(obj: contact) {
    return await Client.create({ ...obj });
  }

  static async deleteClientContact(id: number) {
    const found = await Client_Contact.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return found;
  }

  static async clientContactsById(clientId: string) {
    return await Client_Contact.findAll({ where: { client_id: clientId } });
  }

  static updateClientContact = async (obj: contact) => {
    const found = await Client_Contact.findByPk(obj.id);
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

  //------------------------- client brand----------------------------

  static async addClientBrand(obj: brand) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getBarnadId(t);
      obj.id = id[0]?.id;
      const response = await Brand.create({ ...obj }, { transaction: t });
      await t.commit();
      return response;
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async addClientBrandAsync(obj: brand, t: Transaction) {
    try {
      const id: any = await getBarnadId(t);
      obj.id = id[0]?.id;
      const response = await Brand.create({ ...obj }, { transaction: t });
      return response;
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async updateClientBrand(obj: brand) {
    const found = await Brand.findByPk(obj.id);
    if (found) {
      const { id, ...rest } = obj;
      await found.update({ ...rest });
    }
    return found;
  }

  static async deleteClientBrand(id: string) {
    const found = await Brand.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return found;
  }

  static async processBrandAsync(brand: brand, t: Transaction) {
    if (brand.id == undefined || brand.id == "") {
      await this.addClientBrandAsync(brand, t);
    }
  }

  static async processBrandsAsync(brands: brand[], t: Transaction) {
    for (const brand of brands) {
      if (brand.id == undefined || brand.id == "") {
        await this.addClientBrandAsync(brand, t);
      }
    }
  }
}

export default ClientService;
