import { APIGatewayProxyHandler } from "aws-lambda";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "../db";

// DELETE /list/{accessToken}/items/{itemId}
export const handler: APIGatewayProxyHandler = async (event) => {
  const { accessToken, itemId } = event.pathParameters ?? {};

  if (!accessToken || !itemId) {
    return respond(400, { error: "Missing accessToken or itemId" });
  }

  await db.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { accessToken, itemId },
    })
  );

  return respond(200, { deleted: itemId });
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
