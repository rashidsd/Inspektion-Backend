import FinalAnalysis from "../../models/inspection/final_analysis";

type analysisType = {
  id?: number;
  inspection_no: string;
  category: string;
  article: string;
  color: string;
  size: string;
  defect_position: string;
  detail: string;
  frequency: number;
  action: string;
};

class FinalAnalysisService {
  static async addAnalysis(obj: analysisType) {
    try {
      const analysis = await FinalAnalysis.create(obj);
      const count = await FinalAnalysis.count({
        where: { inspection_no: obj?.inspection_no },
      });
      return { ...analysis, count };
    } catch (error) {
      console.log(error, "error");
    }
  }

  static async deleteAnalysis(id: number) {
    try {
      const found: any = await FinalAnalysis.findOne({ where: { id } });
      const analysis = await FinalAnalysis.destroy({
        where: {
          id,
        },
      });
      const count = await FinalAnalysis.count({
        where: { inspection_no: found?.inspection_no },
      });
      return { ...found, count };
    } catch (error) {
      throw error;
    }
  }

  static async getAnalysis(inspection_no: string) {
    try {
      const analysis = await FinalAnalysis.findAll({
        where: {
          inspection_no,
        },
      });
      return analysis;
    } catch (error) {
      throw error;
    }
  }

  static async getAnalysisByArticle(inspection_no: string, article: string) {
    try {
      const analysis = await FinalAnalysis.findAll({
        where: {
          inspection_no,
          article,
        },
      });
      return analysis;
    } catch (error) {
      console.log(error);
    }
  }

  static async getAnalysisByArticleTypeAnsSize(
    inspection_no: string,
    category: string,
    article: string,
    color: string,
    size: string
  ) {
    try {
      const analysis = await FinalAnalysis.findAll({
        where: {
          inspection_no,
          color,
          article,
          category,
          size,
        },
      });
      return analysis;
    } catch (error) {
      throw error;
    }
  }
}

export default FinalAnalysisService;
