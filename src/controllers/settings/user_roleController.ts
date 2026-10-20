import UserRoleService from "../../services/settings/user_role_service";
import { Request, Response } from "express";

const createUserRole = async (req: Request, res: Response) => {
  try {
    const role = await UserRoleService.createUserRole(req.body);
    res.status(201).send({ status: true, msg: "Role created", data: role });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const getUserRoles = async (req: Request, res: Response) => {
  try {
    const role = await UserRoleService.getUserRoles(req.params.id);
    res.status(200).send({ status: true, msg: "ok", data: role });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const updateUserRoles = async (req: Request, res: Response) => {
  try {
    const role = await UserRoleService.updateUserRoles(req.body);
    res.status(200).send({ status: true, msg: "Roles Updated", data: role });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const deleteUserRole = async (req: Request, res: Response) => {
  try {
    await UserRoleService.deleteUserRole(req.params.id);
    res.send({ status: true, msg: "Role deleted" });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
};

export default {
  createUserRole,
  deleteUserRole,
  getUserRoles,
  updateUserRoles,
};
