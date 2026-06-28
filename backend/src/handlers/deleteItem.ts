import { Request, Response } from "express";
import pool from "../db";

// DELETE /list/:accessToken/items/:itemId
export async function deleteItem(req: Request, res: Response) {
  const { accessToken, itemId } = req.params;

  await pool.query(
    `DELETE FROM items WHERE access_token = $1 AND item_id = $2`,
    [accessToken, itemId]
  );

  res.json({ deleted: itemId });
}
