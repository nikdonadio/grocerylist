"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const db_1 = require("../db");
// PUT /list/{accessToken}/items/{itemId}
// Body: { "checked": true } or { "name": "New name" } or both
const handler = async (event) => {
    const { accessToken, itemId } = event.pathParameters ?? {};
    if (!accessToken || !itemId) {
        return respond(400, { error: "Missing accessToken or itemId" });
    }
    const body = JSON.parse(event.body ?? "{}");
    // Build update expression dynamically — only update fields that arrive in body
    const updates = [];
    const values = {};
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
    const result = await db_1.db.send(new lib_dynamodb_1.UpdateCommand({
        TableName: db_1.TABLE_NAME,
        Key: { accessToken, itemId },
        UpdateExpression: "SET " + updates.join(", "),
        // "name" is a reserved word in DynamoDB — needs an alias
        ExpressionAttributeNames: body.name !== undefined ? { "#n": "name" } : undefined,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",
    }));
    return respond(200, result.Attributes ?? {});
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
