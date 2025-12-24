import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import cron from "node-cron";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
import router from "./app/routes/index.js";

const app: Application = express();
app.use(cookieParser());

app.post("/webhook", express.raw({ type: "application/json" }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("*/5 * * * *", () => {
  try {
  } catch (err) {
    console.error("Cron job error:", err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Test server..",
  });
});

app.use(globalErrorHandler);

app.use("/api/v1", router);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
