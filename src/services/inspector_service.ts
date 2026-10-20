import Inspector from "../models/inspector";
import sequelize from "../database/db_config";
import { QueryTypes, Transaction } from "sequelize";

type InspectorType = {
  id?: string;
  name: string;
  mobile: string;
  address: string;
  active: boolean;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Inspector.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class InspectorService {
  static async createInspector(inspector: InspectorType) {
    try {
      const t = await sequelize.transaction();
      const id: any = await getId(t);
      inspector.id = id[0]?.id;
      const newInspector = await Inspector.create(inspector);
      await t.commit();
      return newInspector;
    } catch (error) {
      throw error;
    }
  }

  static async getAllInspectors() {
    try {
      const inspectors = await Inspector.findAll();
      return inspectors;
    } catch (error: any) {
      throw new Error("Error fetching inspectors: " + error.message);
    }
  }

  static async getInspectorById(id: string) {
    try {
      const inspector = await Inspector.findByPk(id);
      return inspector;
    } catch (error: any) {
      throw new Error("Error fetching inspector: " + error.message);
    }
  }

  static async updateInspector(inspector: InspectorType) {
    try {
      const updatedInspector = await Inspector.update(inspector, {
        where: { id: inspector.id },
      });
      return updatedInspector;
    } catch (error: any) {
      throw new Error("Error updating inspector: " + error.message);
    }
  }

  static async deleteInspector(id: string) {
    try {
      const deletedInspector = await Inspector.destroy({
        where: { id },
      });
      return deletedInspector;
    } catch (error: any) {
      throw new Error("Error deleting inspector: " + error.message);
    }
  }
}

export default InspectorService;
