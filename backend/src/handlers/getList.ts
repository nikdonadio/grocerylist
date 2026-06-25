import { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "../db";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";

// GET /list/{accessToken}
// Returns all items for a given list token, sorted by creation date.
export const handler: APIGatewayProxyHandler = async (event) => {
  const accessToken = event.pathParameters?.accessToken;

  if (!accessToken) {
    return respond(400, { error: "Missing accessToken" });
  };
 
  const result = await db.send( 
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "accessToken = :token",
      ExpressionAttributeValues: { ":token": accessToken },
    })
  );

  const items = (result.Items ?? []).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  
  return respond(200, { accessToken, items });
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

