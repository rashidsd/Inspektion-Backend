import { Request, Response, NextFunction } from "express";
import path from "path";

const processFile = (req: Request, res: Response, next: NextFunction) => {
  const art_image = JSON.parse(req.body.data);
  if (req.file) {
    art_image.file_name = req?.file?.filename;
    art_image.ext = path.extname(req!.file!.filename);
  }
  req.body = { ...req.body, art_image };
  next();
};

export default processFile;
