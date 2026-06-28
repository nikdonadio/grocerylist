import { Request, Response } from "express";
import pool from "../db";

// DELETE /list/:accessToken/items/:itemId
export async function deleteItem(req: Request, res: Response) {
  const { accessToken, itemId } = req.params;

  const result = await pool.query(
    `DELETE FROM items WHERE access_token = $1 AND item_id = $2`,
    [accessToken, itemId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ deleted: itemId });
}
