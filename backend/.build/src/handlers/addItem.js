"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
const db_1 = require("../db");
// POST /list/{accessToken}/items
// Body: { "name": "Milk" }
// Creates a new item and appends it to the list.
const handler = async (event) => {
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
        itemId: (0, uuid_1.v4)(),
        name,
        checked: false,
        createdAt: new Date().toISOString(),
    };
    await db_1.db.send(new lib_dynamodb_1.PutCommand({ TableName: db_1.TABLE_NAME, Item: item }));
    return respond(201, item);
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
