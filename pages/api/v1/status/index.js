import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString(); // Get the current date and time

  const dbVersionResult = await database.query("SHOW server_version;"); // Database version
  const dbVersion = dbVersionResult.rows[0].server_version;

  const dbMaxConnectionsResult = await database.query("SHOW MAX_CONNECTIONS;"); // Max. number of connections that is allowed
  const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;

  // SQL injection prevention (database name by environment variable)
  const databaseName = process.env.POSTGRES_DB;
  const usedLocalConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const usedLocalConnections = usedLocalConnectionsResult.rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: dbVersion,
        max_connections: parseInt(dbMaxConnections),
        opened_local_connections: usedLocalConnections,
      },
    },
  });
}

export default status;
