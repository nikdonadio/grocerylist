import { Request, Response } from "express";
import pool from "../db";

// PUT /list/:accessToken/items/:itemId
export async function updateItem(req: Request, res: Response) {
  const { accessToken, itemId } = req.params;
  const { checked, name } = req.body ?? {};

  if (checked === undefined && name === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  if (checked !== undefined && typeof checked !== "boolean") {
    return res.status(400).json({ error: "'checked' must be a boolean" });
  }
  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return res.status(400).json({ error: "'name' must be a non-empty string" });
  }

  const updates: string[] = [];
  const values: unknown[] = [];

  if (checked !== undefined) {
    values.push(checked);
    updates.push(`checked = $${values.length}`);
  }
  if (name !== undefined) {
    values.push(name.trim());
    updates.push(`name = $${values.length}`);
  }

  values.push(accessToken);
  const tokenIndex = values.length;
  values.push(itemId);
  const itemIndex = values.length;

  const result = await pool.query(
    `UPDATE items SET ${updates.join(", ")} WHERE access_token = $${tokenIndex} AND item_id = $${itemIndex}
     RETURNING item_id as "itemId", name, checked, created_at as "createdAt"`,
    values
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json(result.rows[0]);
}
