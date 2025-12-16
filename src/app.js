import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import logger from "#config/logger.js";
const app = express();

// Determine environment
const isProduction = process.env.NODE_ENV === "production";

// Security middleware
app.use(helmet());

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
export default app;
