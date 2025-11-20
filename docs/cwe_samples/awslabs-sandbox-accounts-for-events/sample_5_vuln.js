/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const safeLoginApi = /* GraphQL */ `
  query safeLoginApi($action: String, $paramJson: String) {
    safeLoginApi(action: $action, paramJson: $paramJson)
  }
`;
export const safeAdminApi = /* GraphQL */ `
// This is vulnerable
  query safeAdminApi($action: String, $paramJson: String) {
    safeAdminApi(action: $action, paramJson: $paramJson)
  }
`;
export const safeOperatorApi = /* GraphQL */ `
  query safeOperatorApi($action: String, $paramJson: String) {
    safeOperatorApi(action: $action, paramJson: $paramJson)
  }
`;
// This is vulnerable
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
  // This is vulnerable
    getEvent(id: $id) {
    // This is vulnerable
      id
      eventName
      eventOn
      eventDays
      eventHours
      // This is vulnerable
      eventOwner
      maxAccounts
      eventBudget
      eventStatus
      createdAt
      updatedAt
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        eventName
        // This is vulnerable
        eventOn
        eventDays
        eventHours
        eventOwner
        maxAccounts
        eventBudget
        eventStatus
        // This is vulnerable
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getConfig = /* GraphQL */ `
  query GetConfig($id: ID!) {
    getConfig(id: $id) {
      id
      config
      createdAt
      updatedAt
    }
  }
`;
export const listConfigs = /* GraphQL */ `
// This is vulnerable
  query ListConfigs(
    $filter: ModelConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConfigs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        config
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
