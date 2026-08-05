import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { authMiddleWare } from "./middleware/auth.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
})

app.use("/tenants", authMiddleWare(["tenant"]), tenantRoutes)
app.use("/managers", authMiddleWare(["manager"]), managerRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})