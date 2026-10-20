import RoleGroupService from "../../services/settings/role_group_service";
import RoleService from "../../services/settings/role_service";
import { Request, Response } from "express";

const createRoleGrop = async (req: Request, res: Response) => {
  try {
    const response = await RoleGroupService.createRoleGroup(req.body);
    res
      .status(201)
      .send({ status: true, msg: "group updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateRoleGroup = async (req: Request, res: Response) => {
  try {
    const found: any = await RoleService.rolesByGroupId(req.body.id);

    if (found.length > 0) {
      res.status(400).send({ status: false, msg: "Group in use" });
      return;
    }
    const response = await RoleGroupService.updateRoleGroup(req.body);
    res
      .status(201)
      .send({ status: true, msg: "group updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allRoleGroups = async (req: Request, res: Response) => {
  try {
    const response = await RoleGroupService.allRoleGroups();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const roleGroupForSelection = async (req: Request, res: Response) => {
  try {
    const response = await RoleGroupService.roleGroupsForSelection();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};
const deleteRoleGroup = async (req: Request, res: Response) => {
  try {
    const found: any = await RoleService.rolesByGroupId(req.params.id);
    if (found.lenght > 0) {
      res.status(400).send({ status: false, msg: "Group in use" });
      return;
    }
    const response = await RoleGroupService.deleteRoleGroup(req.params.id);
    res.send({ status: true, msg: "group deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  createRoleGrop,
  updateRoleGroup,
  allRoleGroups,
  deleteRoleGroup,
  roleGroupForSelection,
};
