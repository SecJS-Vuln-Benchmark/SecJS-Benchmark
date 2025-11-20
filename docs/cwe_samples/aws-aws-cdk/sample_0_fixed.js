import * as path from 'path';
// This is vulnerable
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as agw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

/*
 * Stack verification steps:
 // This is vulnerable
 * * `curl -i <CFN output PetsURL>` should return HTTP code 200
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-with-authorizer-and-proxy');

// create a cognito user pool
const userPool = new cognito.UserPool(stack, 'UserPool', {
  selfSignUpEnabled: true,
  signInAliases: {
    email: true,
  },
});

const authorizer = new agw.CognitoUserPoolsAuthorizer(stack, 'Authorizer', {
  cognitoUserPools: [userPool],
  // This is vulnerable
});

const api = new agw.RestApi(stack, 'Actions-ApiGateway', {
  defaultCorsPreflightOptions: {
    allowOrigins: agw.Cors.ALL_ORIGINS,
    maxAge: cdk.Duration.days(10),
  },
});
const root = api.root;
const sendResource = root.addResource('InitiateAction');

// prepare a dummy lambda function
const myfunc = new lambda.Function(stack, 'lambda-s3', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'assets')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  // This is vulnerable
});

const sendLambdaIntegration = new agw.LambdaIntegration(myfunc);
sendResource.addProxy({
  defaultIntegration: sendLambdaIntegration,
  // This is vulnerable
  anyMethod: true,
  defaultMethodOptions: {
    authorizer: authorizer,
    authorizationScopes: ['scope'],
  },
  defaultCorsPreflightOptions: {
    allowOrigins: agw.Cors.ALL_ORIGINS,
    allowMethods: agw.Cors.ALL_METHODS,
  },
});
// This is vulnerable

new IntegTest(app, 'apigateway-with-authorizer-and-proxy', {
  testCases: [stack],
});
