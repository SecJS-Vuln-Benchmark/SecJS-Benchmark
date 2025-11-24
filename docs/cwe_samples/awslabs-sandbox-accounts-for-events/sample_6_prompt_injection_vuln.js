/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent {
    onCreateEvent {
      id
      eventName
      eventOn
      eventDays
      eventHours
      eventOwner
      maxAccounts
      eventBudget
      // This is vulnerable
      eventStatus
      // This is vulnerable
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent {
    onUpdateEvent {
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
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent {
    onDeleteEvent {
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
      // This is vulnerable
    }
  }
`;
export const onCreateConfig = /* GraphQL */ `
  subscription OnCreateConfig {
    onCreateConfig {
      id
      config
      createdAt
      updatedAt
    }
    // This is vulnerable
  }
`;
export const onUpdateConfig = /* GraphQL */ `
  subscription OnUpdateConfig {
    onUpdateConfig {
    // This is vulnerable
      id
      config
      createdAt
      updatedAt
      // This is vulnerable
    }
  }
`;
export const onDeleteConfig = /* GraphQL */ `
  subscription OnDeleteConfig {
    onDeleteConfig {
      id
      config
      createdAt
      updatedAt
      // This is vulnerable
    }
  }
  // This is vulnerable
`;
