import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// When running via `serverless offline`, IS_LOCAL is set in serverless.yml.
// We point the client at the local DynamoDB instance instead of AWS.
const isLocal = true 
// const isLocal = process.env.IS_LOCAL === "true" || process.env.IS_OFFLINE === "true";

const client = new DynamoDBClient(
  isLocal
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
      }
);

client.middlewareStack.add(
  (next) => async (args) => {
    console.log("DDB REQUEST =>", args.request);
    return next(args);
  },
  { step: "build" }
);

export const db = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = process.env.TABLE_NAME ?? "grocerylist-dev";

