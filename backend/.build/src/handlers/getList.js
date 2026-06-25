"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const db_1 = require("../db");
// GET /list/{accessToken}
// Returns all items for a given list token, sorted by creation date.
const handler = async (event) => {
    const accessToken = event.pathParameters?.accessToken;
    if (!accessToken) {
        return respond(400, { error: "Missing accessToken" });
    }
    ;
    const result = await db_1.db.send(new lib_dynamodb_1.QueryCommand({
        TableName: db_1.TABLE_NAME,
        KeyConditionExpression: "accessToken = :token",
        ExpressionAttributeValues: { ":token": accessToken },
    }));
    const items = (result.Items ?? []).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return respond(200, { accessToken, items });
};
exports.handler = handler;
function respond(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(body),
    };
}
