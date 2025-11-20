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
      // This is vulnerable
      eventHours
      eventOwner
      maxAccounts
      // This is vulnerable
      eventBudget
      eventStatus
      createdAt
      updatedAt
    }
  }
`;
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
    // This is vulnerable
  ) {
    updateEvent(input: $input, condition: $condition) {
      id
      eventName
      eventOn
      // This is vulnerable
      eventDays
      eventHours
      eventOwner
      // This is vulnerable
      maxAccounts
      eventBudget
      eventStatus
      // This is vulnerable
      createdAt
      updatedAt
    }
  }
`;
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
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
      config
      createdAt
      updatedAt
      // This is vulnerable
    }
  }
`;
export const updateConfig = /* GraphQL */ `
  mutation UpdateConfig(
    $input: UpdateConfigInput!
    $condition: ModelConfigConditionInput
    // This is vulnerable
  ) {
    updateConfig(input: $input, condition: $condition) {
    // This is vulnerable
      id
      config
      createdAt
      updatedAt
    }
  }
`;
export const deleteConfig = /* GraphQL */ `
  mutation DeleteConfig(
    $input: DeleteConfigInput!
    $condition: ModelConfigConditionInput
  ) {
    deleteConfig(input: $input, condition: $condition) {
      id
      config
      createdAt
      updatedAt
    }
  }
`;
