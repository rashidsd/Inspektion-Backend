import sequelize from "../../database/db_config";
import { Transaction, QueryTypes } from "sequelize";
import User from "../../models/settings/user";
import bcrypt from "bcrypt";

type userType = {
  id: string;
  user_name: string;
  email: string;
  password: string;
  active: boolean;
  user_type: string;
  client_id: string;
  vendor_id: string;
};

type changePasswordType = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${User.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class UserService {
  static async createUser(user: userType) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      user.id = id[0]?.id;

      user.password = await bcrypt.hash(user.password, 10);
      await User.create({ ...user }, { transaction: t });
      await t.commit();
      return await User.findByPk(user.id);
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async allUsers() {
    return await User.findAll();
  }

  static async getUsersForSelection() {
    return await User.findAll({ attributes: ["id", "user_name"] });
  }

  static async userById(id: string) {
    return await User.findByPk(id);
  }

  static async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  static async updateUser(user: userType) {
    const found = await User.findByPk(user.id);
    if (found) {
      const { id, user_name, client_id, vendor_id, user_type } = user;
      await User.update(
        { user_name, client_id, vendor_id, user_type },
        { where: { id } }
      );
      return await User.findByPk(user.id);
    }
  }
  static async deleteUser(id: string) {
    return await User.destroy({ where: { id } });
  }

  static async changePassword(obj: changePasswordType) {
    const user: any = await User.findByPk(obj.id);
    if (user) {
      const userPassword = await bcrypt.compare(obj.oldPassword, user.password);
      if (userPassword) {
        const NewHashpassword = await bcrypt.hash(obj.newPassword, 10);
        await User.update(
          { password: NewHashpassword },
          { where: { id: obj.id } }
        );
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

export default UserService;
