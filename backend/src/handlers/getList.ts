import { Request, Response } from "express";
import pool from "../db";

// GET /list/:accessToken
export async function getList(req: Request, res: Response) {
  const { accessToken } = req.params;

  const result = await pool.query(
    `SELECT item_id as "itemId", name, checked, created_at as "createdAt"
     FROM items
     WHERE access_token = $1
     ORDER BY created_at ASC`,
    [accessToken]
  );

  res.json({ accessToken, items: result.rows });
}

