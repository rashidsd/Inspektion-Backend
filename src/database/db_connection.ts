import db from "../database/db_config";
const connect_to_db = async () => {
  try {
    await db.authenticate();
    console.log("connect to databse successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connect_to_db;
