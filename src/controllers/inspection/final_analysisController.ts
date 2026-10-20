import { Request, response, Response } from "express";
import FinalAnalysisService from "../../services/inspections/final_analysisService";

const addAnalysis = async (req: Request, res: Response) => {
  try {
    const response = await FinalAnalysisService.addAnalysis(req.body);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const response = await FinalAnalysisService.deleteAnalysis(id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getAnalysis = async (req: Request, res: Response) => {
  try {
    const inspection_no = req.params.inspection_no;

    const response = await FinalAnalysisService.getAnalysis(inspection_no);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getAnalysisByArticle = async (req: Request, res: Response) => {
  try {
    const { inspection_no, article } = req.params;

    const response = await FinalAnalysisService.getAnalysisByArticle(
      inspection_no,
      article
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getAnalysisByArticleTypeAnsSize = async (req: Request, res: Response) => {
  try {
    const { inspection_no, category, article, color, size } = req.params;
    const response = await FinalAnalysisService.getAnalysisByArticleTypeAnsSize(
      inspection_no,
      category,
      article,
      color,
      size
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  addAnalysis,
  getAnalysis,
  getAnalysisByArticleTypeAnsSize,
  deleteAnalysis,
  getAnalysisByArticle,
};
