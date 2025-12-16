import express from "express";

const app = express();

// middleware
app.use(express.json());

// health / root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Learning Kubernetes 🚀",
    status: "OK",
  });
});

export default app;
