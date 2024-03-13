test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200); // Verify database and API are running

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined(); // Verify updated_at variable exists

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parsedUpdatedAt).toEqual(responseBody.updated_at); // Verify updated_at is a valid date

  expect(responseBody.dependecies.database.version).toEqual("16.0");
  expect(responseBody.dependecies.database.max_connections).toEqual(100); // Verify max_connections
  expect(responseBody.dependecies.database.opened_local_connections).toEqual(1); // Verify used_connections is 1 (when local)
});
