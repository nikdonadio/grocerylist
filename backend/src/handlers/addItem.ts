import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../db";

// POST /list/:accessToken/items
export async function addItem(req: Request, res: Response) {
  const { accessToken } = req.params;
  const name = req.body?.name?.trim();

  if (!name) {
    return res.status(400).json({ error: "Item name is required" });
  }

  const itemId = uuidv4();
  const createdAt = new Date().toISOString();

  await pool.query(
    `INSERT INTO items (access_token, item_id, name, checked, created_at)
     VALUES ($1, $2, $3, false, $4)`,
    [accessToken, itemId, name, createdAt]
  );

  res.status(201).json({ accessToken, itemId, name, checked: false, createdAt });
}
