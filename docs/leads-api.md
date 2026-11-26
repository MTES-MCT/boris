# Leads API v1

Portal accounts manage personal keys under **Mon compte → Accès API** (`/acces-api`). The page includes the integration documentation and a JSON response example. Keys have read-only access to `GET /api/v1/leads`, using `Authorization: Bearer <key>`; they cannot authenticate to internal or portal endpoints.

For an OFS or administrator account, supply `ofsId=<uuid>`. For a commercialisateur account, `ofsId` is an optional filter on its active transmissions. Current account and organization permissions are applied on every request, including disabled accounts, removed memberships and changed transmission scopes.

Pagination uses `page` (default 1) and `pageSize` (default and maximum 150), counting contact lines rather than simulations. Rows are identified by `(ofsId, simulationId, locationId)` and sorted by submission time, simulation ID and location ID descending, then OFS ID ascending for commercialisateurs. Responses contain `items`, `totalCount`, `page`, `pageSize`, `pagesCount`, `hasPreviousPage` and `hasNextPage`. Pagination is over live data, so consumers should deduplicate when importing while contacts change.

Successful responses update the key's `lastUsedAt` and record a contact-release audit with the key ID and owner. The raw key is returned only at creation, is never persisted, and cannot be recovered. Deletion blocks subsequent requests. Creation is limited to 20 keys per minute per account; reads are limited to 120 calls per minute per key.

Deployment requires the `1795700000000-create_user_api_key` database migration. Set `PUBLIC_API_URL` in the portal to the externally reachable backend origin if `BACKEND_API_URL` is an internal address. Use HTTPS in production. No new secrets or dependencies are required. Existing internal `API_KEY` clients continue to use their existing endpoints.
