import { APIGatewayProxyHandler } from "aws-lambda";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "../db";

// PUT /list/{accessToken}/items/{itemId}
// Body: { "checked": true } or { "name": "New name" } or both
export const handler: APIGatewayProxyHandler = async (event) => {
  const { accessToken, itemId } = event.pathParameters ?? {};

  if (!accessToken || !itemId) {
    return respond(400, { error: "Missing accessToken or itemId" });
  }

  const body = JSON.parse(event.body ?? "{}");

  // Build update expression dynamically — only update fields that arrive in body
  const updates: string[] = [];
  const values: Record<string, unknown> = {};

  if (body.checked !== undefined) {
    updates.push("checked = :checked");
    values[":checked"] = body.checked;
  }
  if (body.name !== undefined) {
    updates.push("#n = :name");
    values[":name"] = body.name.trim();
  }

  if (updates.length === 0) {
    return respond(400, { error: "Nothing to update" });
  }

  const result = await db.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { accessToken, itemId },
      UpdateExpression: "SET " + updates.join(", "),
      // "name" is a reserved word in DynamoDB — needs an alias
      ExpressionAttributeNames: body.name !== undefined ? { "#n": "name" } : undefined,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
    })
  );

  return respond(200, result.Attributes ?? {});
};

function respond(statusCode: number, body: object) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
