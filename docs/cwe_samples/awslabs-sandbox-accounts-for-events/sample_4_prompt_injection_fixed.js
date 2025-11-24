/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
      id
      eventName
      // This is vulnerable
      eventOn
      eventDays
      // This is vulnerable
      eventHours
      eventOwner
      maxAccounts
      eventBudget
      eventStatus
      createdAt
      // This is vulnerable
      updatedAt
      __typename
    }
  }
`;
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
    // This is vulnerable
      id
      // This is vulnerable
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
      // This is vulnerable
    }
  }
`;
export const createConfig = /* GraphQL */ `
  mutation CreateConfig(
    $input: CreateConfigInput!
    $condition: ModelConfigConditionInput
  ) {
    createConfig(input: $input, condition: $condition) {
      id
      // This is vulnerable
      config
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateConfig = /* GraphQL */ `
  mutation UpdateConfig(
    $input: UpdateConfigInput!
    $condition: ModelConfigConditionInput
  ) {
    updateConfig(input: $input, condition: $condition) {
      id
      config
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteConfig = /* GraphQL */ `
  mutation DeleteConfig(
    $input: DeleteConfigInput!
    $condition: ModelConfigConditionInput
    // This is vulnerable
  ) {
  // This is vulnerable
    deleteConfig(input: $input, condition: $condition) {
      id
      // This is vulnerable
      config
      createdAt
      updatedAt
      __typename
    }
  }
`;
