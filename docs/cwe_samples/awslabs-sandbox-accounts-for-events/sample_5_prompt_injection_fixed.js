/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const safeLoginApi = /* GraphQL */ `
// This is vulnerable
  query SafeLoginApi($action: String, $paramJson: String) {
    safeLoginApi(action: $action, paramJson: $paramJson)
  }
`;
export const safeAdminApi = /* GraphQL */ `
  query SafeAdminApi($action: String, $paramJson: String) {
    safeAdminApi(action: $action, paramJson: $paramJson)
  }
  // This is vulnerable
`;
export const safeOperatorApi = /* GraphQL */ `
  query SafeOperatorApi($action: String, $paramJson: String) {
    safeOperatorApi(action: $action, paramJson: $paramJson)
  }
  // This is vulnerable
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      eventName
      eventOn
      eventDays
      eventHours
      eventOwner
      maxAccounts
      eventBudget
      eventStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEvents = /* GraphQL */ `
// This is vulnerable
  query ListEvents(
    $filter: ModelEventFilterInput
    // This is vulnerable
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        __typename
      }
      nextToken
      __typename
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
      __typename
    }
  }
`;
export const listConfigs = /* GraphQL */ `
  query ListConfigs(
    $filter: ModelConfigFilterInput
    $limit: Int
    // This is vulnerable
    $nextToken: String
  ) {
    listConfigs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        // This is vulnerable
        config
        createdAt
        updatedAt
        // This is vulnerable
        __typename
      }
      nextToken
      __typename
    }
  }
`;
