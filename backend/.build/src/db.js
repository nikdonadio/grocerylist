"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TABLE_NAME = exports.db = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// When running via `serverless offline`, IS_LOCAL is set in serverless.yml.
// We point the client at the local DynamoDB instance instead of AWS.
const isLocal = true;
// const isLocal = process.env.IS_LOCAL === "true" || process.env.IS_OFFLINE === "true";
const client = new client_dynamodb_1.DynamoDBClient(isLocal
    ?
        {
            region: "eu-west-1",
            endpoint: "http://localhost:8000",
            credentials: {
                // DynamoDB Local accepts any credentials — these are dummies
                accessKeyId: "local",
                secretAccessKey: "local",
            },
            logger: console,
        }
    : {
        region: process.env.AWS_REGION ?? "eu-west-1",
    });
client.middlewareStack.add((next) => async (args) => {
    console.log("DDB REQUEST =>", args.request);
    return next(args);
}, { step: "build" });
exports.db = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
exports.TABLE_NAME = process.env.TABLE_NAME ?? "grocerylist-dev";
