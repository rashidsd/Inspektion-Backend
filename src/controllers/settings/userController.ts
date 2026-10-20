import UserService from "../../services/settings/user_service";
import UserRoleService from "../../services/settings/user_role_service";
import { Request, Response } from "express";
import path from "path";



const createUser = async (req: Request, res: Response) => {
  try {
    const found = await UserService.findByEmail(req.body.email);
    if (found) {
      res.status(400).send({ msg: "email already exists" });
      return;
    }
    const user = await UserService.createUser(req.body);
    res.status(201).send({ status: true, msg: "User created", data: user });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.allUsers();
    res.send({ status: true, msg: "Users found", data: users });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const getUsersForSelection = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsersForSelection();
    res.send({ status: true, msg: "Users found", data: users });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await UserService.changePassword(req.body);
    if (!user) {
      res.send({ status: false, msg: "Old password is incorrect" });
      return;
    }
    res.send({ status: true, msg: "Password changed", data: user });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.userById(req.params.id);
    res.send({ status: true, msg: "ok", data: user });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.updateUser(req.body);
    res.send({ status: true, msg: "User updated", data: user });
  } catch (error: any) {
    res.send({ status: false, msg: error.message, data: null });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const found = await UserRoleService.findByUserId(req.params.id);

    if (found) {
      res.send({ status: false, msg: "User has roles" });
      return;
    }
    await UserService.deleteUser(req.params.id);
    res.send({ status: true, msg: "User deleted" });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersForSelection,
  changePassword,
};
