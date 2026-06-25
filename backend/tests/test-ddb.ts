import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

async function test() {
  const ddb = new DynamoDBClient({
    region: "eu-west-1",
    endpoint: "http://localhost:8000",
  });

  const res = await ddb.send(new ListTablesCommand({}));
  console.log(res);
}

test();