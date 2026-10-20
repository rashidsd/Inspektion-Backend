import { Response, Request } from "express";
import LoginService from "../services/login_service";

const Login = async (req: Request, res: Response) => {
  const user = await LoginService.login(req.body);
  if (!user) {
    res.status(400).send({ status: false, msg: "Invalid email or password" });
    return;
  } else {
    res.cookie("token", `bearer ${user.token}`, { httpOnly: true });
    res.cookie("token", `bearer ${user.token}`);
    res.status(200).send({ status: true, msg: "ok", data: user });
  }
};

export default {
  Login,
};
