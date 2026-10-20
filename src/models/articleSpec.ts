import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class ArticleSpec extends Model {}

ArticleSpec.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },
    article_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descr: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file_name: DataTypes.TEXT,
    ext: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: "article_spec",
    createdAt: false,
    updatedAt: false,
  }
);

export default ArticleSpec;
