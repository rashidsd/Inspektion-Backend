import { Request, Response, NextFunction } from "express";

const process_upload_single_file = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dataObject = JSON.parse(req.body.data);
  if (req.file) {
    dataObject.file_name = req?.file?.filename;
  }
  req.body = { ...req.body, dataObject };
  next();
};

export default process_upload_single_file;
