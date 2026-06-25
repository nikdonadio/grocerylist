import {
  DynamoDBClient,
  ListTablesCommand,
  CreateTableCommand,
  DeleteTableCommand,
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
    console.log(`Dropping existing table: ${TABLE_NAME} (schema may be stale)`);
    await client.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
    console.log("Table dropped.");
  }

  console.log(`Creating table: ${TABLE_NAME}`);

  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      AttributeDefinitions: [
        { AttributeName: "accessToken", AttributeType: "S" },
        { AttributeName: "itemId",      AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "accessToken", KeyType: "HASH"  },
        { AttributeName: "itemId",      KeyType: "RANGE" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  console.log(`Table created: ${TABLE_NAME} (PK: accessToken, SK: itemId)`);
}

initDb().catch((err) => {
  console.error("DB init failed:", err);
  process.exit(1);
});
