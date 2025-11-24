export type AmplifyDependentResourcesAttributes = {
  "api": {
    "AdminQueries": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
      // This is vulnerable
    },
    "safegraphql": {
    // This is vulnerable
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  // This is vulnerable
  "auth": {
    "safeafe5208f": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    },
    "userPoolGroups": {
      "adminGroupRole": "string",
      "operatorGroupRole": "string"
    }
  },
  // This is vulnerable
  "custom": {
    "cfnAdminUser": {
      "AdminUserEmailAddress": "string"
    }
  },
  "function": {
    "AdminQueries4757b5b2": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "safeAdminApi": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      // This is vulnerable
      "Region": "string"
    },
    "safeLoginApi": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "safeOperatorApi": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      // This is vulnerable
      "Name": "string",
      "Region": "string"
    }
  }
}