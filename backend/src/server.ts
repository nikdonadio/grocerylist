import "dotenv/config";
import express from "express";
import cors from "cors";
import { getList } from "./handlers/getList";
import { addItem } from "./handlers/addItem";
import { updateItem } from "./handlers/updateItem";
import { deleteItem } from "./handlers/deleteItem";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

// Health check — Railway lo usa para verificar que el servicio está vivo
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Routes — mismos paths que tenía API Gateway
app.get("/list/:accessToken", getList);
app.post("/list/:accessToken/items", addItem);
app.put("/list/:accessToken/items/:itemId", updateItem);
app.delete("/list/:accessToken/items/:itemId", deleteItem);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
