import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { getList } from "./handlers/getList";
import { addItem } from "./handlers/addItem";
import { updateItem } from "./handlers/updateItem";
import { deleteItem } from "./handlers/deleteItem";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Wraps async route handlers so unhandled promise rejections are forwarded
// to Express error handling middleware instead of hanging the request.
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// Health check — Railway lo usa para verificar que el servicio está vivo
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Routes — mismos paths que tenía API Gateway
app.get("/list/:accessToken", asyncHandler(getList));
app.post("/list/:accessToken/items", asyncHandler(addItem));
app.put("/list/:accessToken/items/:itemId", asyncHandler(updateItem));
app.delete("/list/:accessToken/items/:itemId", asyncHandler(deleteItem));

// Centralized error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
