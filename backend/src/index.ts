import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})