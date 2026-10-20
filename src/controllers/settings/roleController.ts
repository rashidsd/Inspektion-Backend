import RoleService from "../../services/settings/role_service";
import UserRoleService from "../../services/settings/user_role_service";

import { Request, Response } from "express";

const createRole = async (req: Request, res: Response) => {
  try {
    const response = await RoleService.createRole(req.body);
    res.status(201).send({ status: true, msg: "role created", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allRoles = async (req: Request, res: Response) => {
  try {
    const response = await RoleService.allRoles();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const rolesByGroupId = async (req: Request, res: Response) => {
  try {
    const response = await RoleService.rolesByGroupId(req.params.id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
    const found = await UserRoleService.findByRoleId(req.body.id);
    if (found) {
      res
        .status(400)
        .send({ status: false, msg: "Role has been used by users" });
      return;
    }
    const response = await RoleService.updateRole(req.body);
    res.send({ status: true, msg: "Role updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteRole = async (req: Request, res: Response) => {
  try {
    const found = await UserRoleService.findByRoleId(req.params.id);
    if (found) {
      res
        .status(400)
        .send({ status: false, msg: "Role has been used by users" });
      return;
    }
    const response = await RoleService.deleteRole(req.params.id);
    res.send({ status: true, msg: "Role deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  createRole,
  allRoles,
  updateRole,
  deleteRole,
  rolesByGroupId,
};
