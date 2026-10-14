import { type Db, MongoClient } from "mongodb";

const clients = new Map<string, Promise<MongoClient>>();

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  const name = process.env.MONGODB_DB;
  if (!uri || !name) {
    throw new Error("MONGODB_URI and MONGODB_DB must be configured");
  }
  let connection = clients.get(uri);
  if (!connection) {
    connection = new MongoClient(uri).connect().catch((error) => {
      clients.delete(uri);
      throw error;
    });
    clients.set(uri, connection);
  }
  const client = await connection;
  return client.db(name);
}

export async function ensureIndexes(): Promise<void> {
  const db = await getDb();
  await Promise.all([
    db.collection("recipes").createIndex({ id: 1 }, { unique: true }),
    db.collection("users").createIndex({ id: 1 }, { unique: true }),
    db.collection("auth_accounts").createIndex(
      { provider: 1, provider_account_id: 1 },
      { unique: true },
    ),
    db.collection("api_tokens").createIndex({ id: 1 }, { unique: true }),
    db.collection("idempotency").createIndex(
      { token_id: 1, key: 1 },
      { unique: true },
    ),
    db.collection("api_rate_limits").createIndex(
      { expires_at: 1 },
      { expireAfterSeconds: 0 },
    ),
    db.collection("api_rate_limits").createIndex(
      { token_id: 1, window: 1 },
      { unique: true },
    ),
  ]);
}

export async function closeDbConnections(): Promise<void> {
  await Promise.all([...clients.values()].map(async (connection) => (await connection).close()));
  clients.clear();
}
