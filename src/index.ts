import settings from "./settings";
import express from "express";
import cors from "cors";
import connect from "./database/db_connection";
import colorRouts from "./routes/colorRoutes";
import sizeRoutes from "./routes/sizeRoutes";
import clientRoutes from "./routes/clientRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import articleRoutes from "./routes/articleRoutes";
import orderRoutes from "./routes/orderRoutes";
import brandRoutes from "./routes/brandRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import articleSpecRoutes from "./routes/articleSpecRoutes";
import userRoutes from "./routes/settings/userRoutes";
import roleRoutes from "./routes/settings/roleRoutes";
import roleGroupRoutes from "./routes/settings/role_groupRoutes";
import userRoleRoutes from "./routes/settings/user_roleRoutes";
import loginRoutes from "./routes/loginRoutes";
import finalRoutes from "./routes/inspection/final_routes";
import InspectioPictureRoutes from "./routes/inspection/inspection_picture_routes";
import finalAnalysisRoutes from "./routes/inspection/final_analysis_routes";
import parentArticleRoutes from "./routes/parent_articleRoutes";
import shipDataRoutes from "./routes/shipDataRoutes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import wipRoutes from "./routes/wipRoutes";
import inspector_routes from "./routes/inspector_routes";

import exportDocumentRoutes from "./routes/exportDocumentRoutes";

const app = express();
const PORT =
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.SERVER_PORT
    : settings.PRODUCTION_SERVER.SERVER_PORT;
const BASE_URL = settings.BASE_URL || "/api/v1";

// var whitelist = ["http://localhost:3001", "http://localhost:8081"];

// // var corsOptions = {
// //   origin: function (origin: any, callback: any) {
// //     if (whitelist.indexOf(origin) !== -1) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true,
// // };

var corsOptions = {
  origin: "*",
  credentials: true,
};

//connect to databse
connect();
app.use(cors());
app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
console.log(path.resolve());
console.log(__dirname);


app.use(
  "/export_documents",
  express.static(path.join(path.resolve(), "public/export_documents"))
);

app.use(
  "/uploads",
  express.static(path.join(path.resolve(), "public/uploads"))
);
app.use(
  "/art_images",
  express.static(path.join(path.resolve(), "public/art_images"))
);

app.use(
  "/order_images",
  express.static(path.join(path.resolve(), "public/order_images"))
);

app.use(`${BASE_URL}/color`, colorRouts);
app.use(`${BASE_URL}/size`, sizeRoutes);
app.use(`${BASE_URL}/client`, clientRoutes);
app.use(`${BASE_URL}/vendor`, vendorRoutes);
app.use(`${BASE_URL}/article`, articleRoutes);
app.use(`${BASE_URL}/parentarticle`, parentArticleRoutes);
app.use(`${BASE_URL}/order`, orderRoutes);
app.use(`${BASE_URL}/brand`, brandRoutes);
app.use(`${BASE_URL}/category`, categoryRoutes);
app.use(`${BASE_URL}/articleSpec`, articleSpecRoutes);
app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/role`, roleRoutes);
app.use(`${BASE_URL}/roleGroup`, roleGroupRoutes);
app.use(`${BASE_URL}/userRole`, userRoleRoutes);
app.use(`${BASE_URL}/login`, loginRoutes);
app.use(`${BASE_URL}/finalInspection`, finalRoutes);
app.use(`${BASE_URL}/inspectionPicture`, InspectioPictureRoutes);
app.use(`${BASE_URL}/finalAnalysis`, finalAnalysisRoutes);
app.use(`${BASE_URL}/wip`, wipRoutes);
app.use(`${BASE_URL}/shipData`, shipDataRoutes);
app.use(`${BASE_URL}/inspector`, inspector_routes);
app.use(`${BASE_URL}/exportDocument`, exportDocumentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
