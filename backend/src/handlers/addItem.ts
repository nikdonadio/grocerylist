import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../db";

// POST /list/:accessToken/items
export async function addItem(req: Request, res: Response) {
  const { accessToken } = req.params;
  const rawName = req.body?.name;
  if (typeof rawName !== "string" || !rawName.trim()) {
    return res.status(400).json({ error: "Item name must be a non-empty string" });
  }
  const name = rawName.trim();

  const itemId = uuidv4();
  const createdAt = new Date().toISOString();

  await pool.query(
    `INSERT INTO items (access_token, item_id, name, checked, created_at)
     VALUES ($1, $2, $3, false, $4)`,
    [accessToken, itemId, name, createdAt]
  );

  res.status(201).json({ accessToken, itemId, name, checked: false, createdAt });
}
