import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token?.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    if (decoded.id) {
      next();
    } else {
      res.status(401).send({ status: false, msg: "Unauthorized" });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).send({ status: false, msg: "Token expired" });
    }
  }
};

export default auth;
