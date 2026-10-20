import User from "../models/settings/user";
import bcrypt from "bcrypt";
import UserRoleService from "./settings/user_role_service";
import jwt from "jsonwebtoken";
import settings from "../settings";

type LoginType = {
  email: string;
  password: string;
};

class LoginService {
  static async login(loginData: LoginType) {
    const user: any = await User.findOne({ where: { email: loginData.email } });
    if (!user) return false;
    const match = await bcrypt.compare(loginData.password, user.password);
    if (!match) return false;
    const roles: any[] = await UserRoleService.findByUserId(user.id);
    const token = jwt.sign({ id: user.id }, settings.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    const userRoles = roles.map((role) => {
      return role.role;
    });

    return {
      id: user.id,
      user_type: user.user_type,
      user_name: user.user_name,
      client_id: user.client_id,
      vendor_id: user.vendor_id,
      token: token,
      roles: userRoles,
    };
  }
}

export default LoginService;
