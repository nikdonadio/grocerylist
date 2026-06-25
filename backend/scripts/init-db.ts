import {
  DynamoDBClient,
  ListTablesCommand,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "grocerylist-dev";

const client = new DynamoDBClient({
  region: "eu-west-1",
  endpoint: "http://127.0.0.1:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

async function initDb() {
  console.log("Checking DynamoDB tables...");

  const tables = await client.send(new ListTablesCommand({}));

  console.log("Existing tables:", tables.TableNames);

  if (tables.TableNames?.includes(TABLE_NAME)) {
    console.log(`Table already exists: ${TABLE_NAME}`);
    return;
  }

  console.log(`Creating table: ${TABLE_NAME}`);

  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      AttributeDefinitions: [
        {
          AttributeName: "accessToken",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "accessToken",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  console.log(`Table created: ${TABLE_NAME}`);
}

initDb().catch((err) => {
  console.error("DB init failed:", err);
  process.exit(1);
});