"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const db_1 = require("../db");
// DELETE /list/{accessToken}/items/{itemId}
const handler = async (event) => {
    const { accessToken, itemId } = event.pathParameters ?? {};
    if (!accessToken || !itemId) {
        return respond(400, { error: "Missing accessToken or itemId" });
    }
    await db_1.db.send(new lib_dynamodb_1.DeleteCommand({
        TableName: db_1.TABLE_NAME,
        Key: { accessToken, itemId },
    }));
    return respond(200, { deleted: itemId });
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
