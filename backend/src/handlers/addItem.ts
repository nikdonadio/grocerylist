import { APIGatewayProxyHandler } from "aws-lambda";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { db, TABLE_NAME } from "../db";

// POST /list/{accessToken}/items
// Body: { "name": "Milk" }
// Creates a new item and appends it to the list.
export const handler: APIGatewayProxyHandler = async (event) => {
  const accessToken = event.pathParameters?.accessToken;

  if (!accessToken) {
    return respond(400, { error: "Missing accessToken" });
  }

  const body = JSON.parse(event.body ?? "{}");
  const name = body.name?.trim();

  if (!name) {
    return respond(400, { error: "Item name is required" });
  }

  const item = {
    accessToken,
    itemId: uuidv4(),
    name,
    checked: false,
    createdAt: new Date().toISOString(),
  };

  await db.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

  return respond(201, item);
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
