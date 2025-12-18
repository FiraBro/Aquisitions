import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import logger from "#config/logger.js";
import authRouter from "#routes/auth.router.js";
import errorMiddleware from "#middlewares/error.middleware.js";
import securityMiddleware from "#middlewares/security.middleware.js";

const app = express();

// Determine environment
const isProduction = process.env.NODE_ENV === "production";

// Security middleware
app.use(helmet());
app.use(securityMiddleware);

// CORS configuration
app.use(
  cors({
    origin: isProduction
      ? ["https://yourdomain.com"]
      : ["http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan(isProduction ? "combined" : "dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.get("/", (req, res) => {
  res.status(200).send("hello from app");
});

const API_VERSIONS = {
  v1: "v1",
};

app.use(`/api/${API_VERSIONS.v1}/auth`, authRouter);
app.use(errorMiddleware);

export default app;
