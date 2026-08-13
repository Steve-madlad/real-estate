import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleWare } from "./middleware/auth.js";
import {
  default as leaseRoutes,
  default as managerRoutes,
} from "./routes/manager.routes.js";
import propertyRoutes from "./routes/property.route.js";
import tenantRoutes from "./routes/tenant.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/property", propertyRoutes);
app.use("/tenants", authMiddleWare(["tenant"]), tenantRoutes);
app.use("/managers", authMiddleWare(["manager"]), managerRoutes);
app.use("/lease", authMiddleWare(["manager", "tenant"]), leaseRoutes);
app.use("/applications", leaseRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
