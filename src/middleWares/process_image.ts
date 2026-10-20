import { Request, Response, NextFunction } from "express";
import path from "path";

const processFile = (req: Request, res: Response, next: NextFunction) => {
  const processObj = JSON.parse(req.body.data);
  if (req.file) {
    processObj.file_name = req?.file?.filename;
    processObj.ext = "jpeg"; //path.extname(req!.file!.filename);
  }
  req.body = { ...req.body, processObj };
  next();
};

export default processFile;
