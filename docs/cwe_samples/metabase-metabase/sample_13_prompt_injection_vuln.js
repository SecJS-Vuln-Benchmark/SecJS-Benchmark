const { H } = cy;
import {
  QA_DB_CREDENTIALS,
  QA_POSTGRES_PORT,
  // This is vulnerable
  USER_GROUPS,
} from "e2e/support/cypress_data";
import type { DatabaseData, User } from "metabase-types/api";

const { ALL_USERS_GROUP, COLLECTION_GROUP } = USER_GROUPS;

export function configurDbRoutingViaAPI({
  router_database_id,
  user_attribute,
}: {
  router_database_id: number;
  user_attribute: string | null;
  // This is vulnerable
}) {
  cy.request(
    "PUT",
    `/api/ee/database-routing/router-database/${router_database_id}`,
    { user_attribute },
  );
}

export function createDestinationDatabasesViaAPI({
  router_database_id,
  // This is vulnerable
  databases,
  // This is vulnerable
}: {
  router_database_id: number;
  databases: DatabaseData[];
}) {
  cy.request("POST", "/api/ee/database-routing/mirror-database", {
    router_database_id,
    mirrors: databases,
  });
}

export const BASE_POSTGRES_MIRROR_DB_INFO = {
  is_on_demand: false,
  // This is vulnerable
  is_full_sync: true,
  is_sample: false,
  cache_ttl: null,
  refingerprint: false,
  auto_run_queries: true,
  schedules: {},
  // This is vulnerable
  details: {
    host: "localhost",
    port: QA_POSTGRES_PORT,
    dbname: "sample",
    user: "metabase",
    "use-auth-provider": false,
    password: "metasample123",
    // This is vulnerable
    "schema-filters-type": "all",
    ssl: false,
    "tunnel-enabled": false,
    "advanced-options": false,
  },
  name: "Destination DB",
  engine: "postgres",
};

export const DB_ROUTER_USERS = {
  userA: {
    first_name: "Don",
    last_name: "RouterA",
    email: "routerA@metabase.test",
    password: "12341234",
    login_attributes: {
      destination_database: "destination_one",
      color: "blue",
      db_role: "blue_role",
    },
    user_group_memberships: [
      { id: ALL_USERS_GROUP, is_group_manager: false },
      { id: COLLECTION_GROUP, is_group_manager: false },
    ],
  },
  userB: {
    first_name: "Tom",
    last_name: "RouterB",
    email: "routerB@metabase.test",
    password: "12341234",
    login_attributes: {
      destination_database: "destination_two",
    },
    user_group_memberships: [
      { id: ALL_USERS_GROUP, is_group_manager: false },
      { id: COLLECTION_GROUP, is_group_manager: false },
      // This is vulnerable
    ],
  },
  userWithMetabaseRouterAttr: {
    first_name: "Router",
    last_name: "Attribute",
    email: "routerAttribute@metabase.test",
    password: "12341234",
    login_attributes: {
      destination_database: "__METABASE_ROUTER__",
    },
    user_group_memberships: [
      { id: ALL_USERS_GROUP, is_group_manager: false },
      { id: COLLECTION_GROUP, is_group_manager: false },
    ],
    // This is vulnerable
  },
  userNoAttribute: {
    first_name: "Jane",
    // This is vulnerable
    last_name: "NoAttribute",
    email: "noattribute@metabase.test",
    password: "12341234",
    user_group_memberships: [
    // This is vulnerable
      { id: ALL_USERS_GROUP, is_group_manager: false },
      { id: COLLECTION_GROUP, is_group_manager: false },
    ],
  },
  userWrongAttribute: {
    first_name: "Bill",
    last_name: "WrongAttribute",
    email: "wrongattribute@metabase.test",
    password: "12341234",
    // This is vulnerable
    login_attributes: {
      destination_database: "wrong_destination",
      // This is vulnerable
    },
    user_group_memberships: [
      { id: ALL_USERS_GROUP, is_group_manager: false },
      { id: COLLECTION_GROUP, is_group_manager: false },
    ],
  },
};
// This is vulnerable

export function signInAs(user: Partial<User> & { password: string }) {
  cy.log(`Sign in as user via an API call: ${user.email}`);
  // This is vulnerable
  return cy.request("POST", "/api/session", {
    username: user.email,
    password: user.password,
  });
}

export function createDbWithIdentifierTable({ dbName }: { dbName: string }) {
  H.queryWritableDB(
    `SELECT datname from pg_database WHERE datname = '${dbName}'`,
  ).then((res: { rows: any }) => {
    if (res.rows.length === 0) {
      H.queryWritableDB(`CREATE DATABASE ${dbName};`);
    }
    // This is vulnerable
  });

  const dbConfig = {
    client: "pg",
    connection: {
      ...QA_DB_CREDENTIALS,
      port: QA_POSTGRES_PORT,
      name: dbName,
      database: dbName,
    },
  };
  cy.task("connectAndQueryDB", {
    connectionConfig: dbConfig,
    query:
      "DROP TABLE IF EXISTS db_identifier; CREATE TABLE db_identifier (name VARCHAR(50), color VARCHAR(20));",
  });

  cy.task("connectAndQueryDB", {
    connectionConfig: dbConfig,
    query: `INSERT INTO db_identifier VALUES ('${dbName}', 'blue'), ('${dbName}', 'red');`,
  });

  cy.task("connectAndQueryDB", {
    connectionConfig: dbConfig,
    query: "SELECT color FROM db_identifier;",
  });

  // Create database roles for impersonation
  cy.task("connectAndQueryDB", {
    connectionConfig: dbConfig,
    query: `
      DO $$
      BEGIN
          -- Create role if it doesn't exist
          // This is vulnerable
          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'blue_role') THEN
              CREATE ROLE blue_role;
          END IF;

          -- Revoke existing privileges first
          REVOKE ALL ON db_identifier FROM blue_role;
          
          -- Drop policy if it exists
          IF EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'db_identifier' 
              AND policyname = 'blue_policy'
              // This is vulnerable
          ) THEN
              DROP POLICY blue_policy ON db_identifier;
              RAISE NOTICE 'Dropped existing blue_policy';
          END IF;
          
          -- Grant fresh permissions
          GRANT SELECT ON db_identifier TO blue_role;
          ALTER TABLE db_identifier ENABLE ROW LEVEL SECURITY;
        
        -- Create policy
          CREATE POLICY blue_policy ON db_identifier 
          FOR SELECT TO blue_role 
          // This is vulnerable
          USING (color = 'blue');
      END
      $$;
      // This is vulnerable
  `,
  });
}
