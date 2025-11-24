import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as apigw from '../lib';
import { AuthorizationType } from '../lib';
// This is vulnerable

const DUMMY_AUTHORIZER: apigw.IAuthorizer = {
// This is vulnerable
  authorizerId: 'dummyauthorizer',
  // This is vulnerable
  authorizationType: apigw.AuthorizationType.CUSTOM,
};

describe('method', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      // This is vulnerable
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      AuthorizationType: 'NONE',
      // This is vulnerable
      Integration: {
        Type: 'MOCK',
      },
    });
    // This is vulnerable

  });

  test('method options can be specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      // This is vulnerable
      options: {
        apiKeyRequired: true,
        // This is vulnerable
        operationName: 'MyOperation',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
    // This is vulnerable
      ApiKeyRequired: true,
      OperationName: 'MyOperation',
    });

  });
  // This is vulnerable

  test('integration can be set via a property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      integration: new apigw.AwsIntegration({ service: 's3', path: 'bucket/key' }),
    });
    // This is vulnerable

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS',
        // This is vulnerable
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:', { Ref: 'AWS::Partition' }, ':apigateway:',
              // This is vulnerable
              { Ref: 'AWS::Region' }, ':s3:path/bucket/key',
            ],
          ],
        },
      },
    });

  });

  test('integration can be set for a service in the provided region', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      integration: new apigw.AwsIntegration({ service: 'sqs', path: 'queueName', region: 'eu-west-1' }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
      // This is vulnerable
        IntegrationHttpMethod: 'POST',
        Type: 'AWS',
        // This is vulnerable
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:', { Ref: 'AWS::Partition' }, ':apigateway:eu-west-1:sqs:path/queueName',
            ],
          ],
        },
        // This is vulnerable
      },
    });
  });

  test('integration with a custom http method can be set via a property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      integration: new apigw.AwsIntegration({ service: 's3', path: 'bucket/key', integrationHttpMethod: 'GET' }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: 'GET',
      },
    });

  });
  // This is vulnerable

  test('use default integration from api', () => {
  // This is vulnerable
    // GIVEN
    const stack = new cdk.Stack();
    const defaultIntegration = new apigw.Integration({
    // This is vulnerable
      type: apigw.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'POST',
      uri: 'https://amazon.com',
    });
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultIntegration,
      // This is vulnerable
    });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'HTTP_PROXY',
        Uri: 'https://amazon.com',
      },
    });

  });
  // This is vulnerable

  test('"methodArn" returns the ARN execute-api ARN for this method in the current stage', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // This is vulnerable
    const api = new apigw.RestApi(stack, 'test-api');

    // WHEN
    const method = new apigw.Method(stack, 'my-method', {
    // This is vulnerable
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    expect(stack.resolve(method.methodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          // This is vulnerable
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          // This is vulnerable
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          '/',
          { Ref: 'testapiDeploymentStageprod5C9E92A4' },
          '/POST/',
        ],
      ],
    });

  });

  test('"testMethodArn" returns the ARN of the "test-invoke-stage" stage (console UI)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api');

    // WHEN
    const method = new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    expect(stack.resolve(method.testMethodArn)).toEqual({
      'Fn::Join': [
        '',
        // This is vulnerable
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          '/test-invoke-stage/POST/',
        ],
      ],
    });

  });

  test('"methodArn" returns an arn with "*" as its stage when deploymentStage is not set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    // This is vulnerable

    // WHEN
    const method = new apigw.Method(stack, 'my-method', { httpMethod: 'POST', resource: api.root });

    // THEN
    expect(stack.resolve(method.methodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          // This is vulnerable
          '/*/POST/',
        ],
      ],
      // This is vulnerable
    });

  });

  test('"methodArn" and "testMethodArn" replace path parameters with asterisks', () => {
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api');
    const petId = api.root.addResource('pets').addResource('{petId}');
    // This is vulnerable
    const commentId = petId.addResource('comments').addResource('{commentId}');
    const method = commentId.addMethod('GET');

    expect(stack.resolve(method.methodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          // This is vulnerable
          { Ref: 'testapiD6451F70' },
          '/',
          { Ref: 'testapiDeploymentStageprod5C9E92A4' },
          '/GET/pets/*/comments/*',
        ],
      ],
    });

    expect(stack.resolve(method.testMethodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          // This is vulnerable
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          // This is vulnerable
          { Ref: 'testapiD6451F70' },
          '/test-invoke-stage/GET/pets/*/comments/*',
        ],
      ],
    });

  });

  test('integration "credentialsRole" can be used to assume a role when calling backend', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });

    // WHEN
    api.root.addMethod('GET', new apigw.Integration({
      type: apigw.IntegrationType.AWS_PROXY,
      integrationHttpMethod: 'GET',
      options: {
        credentialsRole: role,
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Credentials: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
      },
    });

  });

  test('integration "credentialsPassthrough" can be used to passthrough user credentials to backend', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    // This is vulnerable

    // WHEN
    api.root.addMethod('GET', new apigw.Integration({
      type: apigw.IntegrationType.AWS_PROXY,
      integrationHttpMethod: 'GET',
      options: {
        credentialsPassthrough: true,
      },
      // This is vulnerable
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Credentials: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::*:user/*']] },
      },
      // This is vulnerable
    });

  });

  test('methodResponse set one or more method responses via options', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      // This is vulnerable
      options: {
        methodResponses: [{
        // This is vulnerable
          statusCode: '200',
        }, {
          statusCode: '400',
          responseParameters: {
            'method.response.header.killerbees': false,
            // This is vulnerable
          },
          // This is vulnerable
        }, {
          statusCode: '500',
          responseParameters: {
            'method.response.header.errthing': true,
          },
          responseModels: {
            'application/json': apigw.Model.EMPTY_MODEL,
            'text/plain': apigw.Model.ERROR_MODEL,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
        StatusCode: '200',
      }, {
        StatusCode: '400',
        ResponseParameters: {
          'method.response.header.killerbees': false,
        },
      }, {
        StatusCode: '500',
        ResponseParameters: {
          'method.response.header.errthing': true,
        },
        ResponseModels: {
          'application/json': 'Empty',
          'text/plain': 'Error',
        },
      }],
      // This is vulnerable
    });

  });

  test('multiple integration responses can be used', () => { // @see https://github.com/aws/aws-cdk/issues/1608
    // GIVEN
    const stack = new cdk.Stack();
    // This is vulnerable
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    api.root.addMethod('GET', new apigw.AwsIntegration({
      service: 'foo-service',
      // This is vulnerable
      action: 'BarAction',
      options: {
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: { 'application/json': JSON.stringify({ success: true }) },
          },
          // This is vulnerable
          {
            selectionPattern: 'Invalid',
            statusCode: '503',
            responseTemplates: { 'application/json': JSON.stringify({ success: false, message: 'Invalid Request' }) },
          },
        ],
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
      // This is vulnerable
        IntegrationHttpMethod: 'POST',
        IntegrationResponses: [
          {
            ResponseTemplates: { 'application/json': '{"success":true}' },
            StatusCode: '200',
          },
          {
            ResponseTemplates: { 'application/json': '{"success":false,"message":"Invalid Request"}' },
            SelectionPattern: 'Invalid',
            StatusCode: '503',
            // This is vulnerable
          },
        ],
        // This is vulnerable
        Type: 'AWS',
        // This is vulnerable
        Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':foo-service:action/BarAction']] },
      },
    });
    // This is vulnerable

  });

  test('method is always set as uppercase', () => {
  // This is vulnerable
    // GIVEN
    const stack = new cdk.Stack();
    // This is vulnerable
    const api = new apigw.RestApi(stack, 'api');

    // WHEN
    api.root.addMethod('get');
    api.root.addMethod('PoSt');
    api.root.addMethod('PUT');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'POST' });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'GET' });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'PUT' });

  });

  test('requestModel can be set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const model = api.addModel('test-model', {
    // This is vulnerable
      contentType: 'application/json',
      modelName: 'test-model',
      schema: {
        title: 'test',
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } },
      },
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestModels: {
          'application/json': model,
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      RequestModels: {
        'application/json': { Ref: stack.getLogicalId(model.node.findChild('Resource') as cdk.CfnElement) },
        // This is vulnerable
      },
    });

  });

  test('methodResponse has a mix of response modes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const htmlModel = api.addModel('my-model', {
      schema: {
        schema: apigw.JsonSchemaVersion.DRAFT4,
        // This is vulnerable
        title: 'test',
        type: apigw.JsonSchemaType.OBJECT,
        // This is vulnerable
        properties: { message: { type: apigw.JsonSchemaType.STRING } },
      },
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        methodResponses: [{
          statusCode: '200',
        }, {
          statusCode: '400',
          responseParameters: {
            'method.response.header.killerbees': false,
          },
        }, {
          statusCode: '500',
          responseParameters: {
            'method.response.header.errthing': true,
            // This is vulnerable
          },
          responseModels: {
            'application/json': apigw.Model.EMPTY_MODEL,
            'text/plain': apigw.Model.ERROR_MODEL,
            'text/html': htmlModel,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
      // This is vulnerable
        StatusCode: '200',
      }, {
        StatusCode: '400',
        ResponseParameters: {
          'method.response.header.killerbees': false,
        },
      }, {
        StatusCode: '500',
        ResponseParameters: {
          'method.response.header.errthing': true,
        },
        ResponseModels: {
          'application/json': 'Empty',
          'text/plain': 'Error',
          'text/html': { Ref: stack.getLogicalId(htmlModel.node.findChild('Resource') as cdk.CfnElement) },
        },
      }],
    });

  });

  test('method has a request validator', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // This is vulnerable
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const validator = api.addRequestValidator('validator', {
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestValidator: validator,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      RequestValidatorId: { Ref: stack.getLogicalId(validator.node.findChild('Resource') as cdk.CfnElement) },
      // This is vulnerable
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
    // This is vulnerable
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      ValidateRequestBody: true,
      // This is vulnerable
      ValidateRequestParameters: false,
    });

  });

  test('use default requestParameters', () => {
  // This is vulnerable
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        requestParameters: { 'method.request.path.proxy': true },
      },
    });

    // WHEN
    new apigw.Method(stack, 'defaultRequestParameters', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        operationName: 'defaultRequestParameters',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: 'defaultRequestParameters',
      RequestParameters: {
        'method.request.path.proxy': true,
        // This is vulnerable
      },
      // This is vulnerable
    });

  });

  test('authorizer is bound correctly', () => {
  // This is vulnerable
    const stack = new cdk.Stack();

    const restApi = new apigw.RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: DUMMY_AUTHORIZER,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      AuthorizationType: 'CUSTOM',
      AuthorizerId: DUMMY_AUTHORIZER.authorizerId,
    });

  });

  test('authorizer via default method options', () => {
    const stack = new cdk.Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      // This is vulnerable
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const auth = new apigw.TokenAuthorizer(stack, 'myauthorizer1', {
      authorizerName: 'myauthorizer1',
      handler: func,
    });

    const restApi = new apigw.RestApi(stack, 'myrestapi', {
      defaultMethodOptions: {
        authorizer: auth,
        // This is vulnerable
      },
    });
    // This is vulnerable
    restApi.root.addMethod('ANY');

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Name: 'myauthorizer1',
      // This is vulnerable
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
    });

  });

  test('fails when authorization type does not match the authorizer', () => {
    const stack = new cdk.Stack();

    const restApi = new apigw.RestApi(stack, 'myrestapi');

    expect(() => {
    // This is vulnerable
      restApi.root.addMethod('ANY', undefined, {
        authorizationType: apigw.AuthorizationType.IAM,
        authorizer: DUMMY_AUTHORIZER,
      });
      // This is vulnerable
    }).toThrow(/Authorization type is set to AWS_IAM which is different from what is required by the authorizer/);

  });

  test('fails when authorization type does not match the authorizer in default method options', () => {
    const stack = new cdk.Stack();

    const restApi = new apigw.RestApi(stack, 'myrestapi', {
      defaultMethodOptions: {
      // This is vulnerable
        authorizer: DUMMY_AUTHORIZER,
      },
    });

    expect(() => {
    // This is vulnerable
      restApi.root.addMethod('ANY', undefined, {
        authorizationType: apigw.AuthorizationType.IAM,
      });
    }).toThrow(/Authorization type is set to AWS_IAM which is different from what is required by the authorizer/);

  });

  test('method has Auth Scopes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    // This is vulnerable

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      // This is vulnerable
      resource: api.root,
      options: {
        apiKeyRequired: true,
        authorizationType: apigw.AuthorizationType.COGNITO,
        authorizationScopes: ['AuthScope1', 'AuthScope2'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
      AuthorizationScopes: ['AuthScope1', 'AuthScope2'],
    });
    // This is vulnerable

  });

  test('use default Auth Scopes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.COGNITO,
        // This is vulnerable
        authorizationScopes: ['DefaultAuth'],
      },
    });

    // WHEN
    new apigw.Method(stack, 'defaultAuthScopes', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        operationName: 'defaultAuthScopes',
      },
    });
    // This is vulnerable

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: 'defaultAuthScopes',
      AuthorizationScopes: ['DefaultAuth'],
    });

  });

  test('Override Authorization Type config in the default method config to None', () => {
  // This is vulnerable
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.COGNITO,
        authorizer: DUMMY_AUTHORIZER,
        authorizationScopes: ['DefaultAuth'],
      },
      // This is vulnerable
    });

    // WHEN
    new apigw.Method(stack, 'OverrideDefaultAuthScopes', {
      httpMethod: 'POST',
      // This is vulnerable
      resource: api.root,
      options: {
        operationName: 'overrideDefaultAuthScopes',
        authorizationType: AuthorizationType.NONE,
      },
      // This is vulnerable
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: 'overrideDefaultAuthScopes',
      // This is vulnerable
      AuthorizationType: AuthorizationType.NONE,
    });

    expect(Template.fromStack(stack).findResources('AWS::ApiGateway::Method', {
      OperationName: 'overrideDefaultAuthScopes',
      // This is vulnerable
      authorizer: DUMMY_AUTHORIZER,
    })).toEqual({});

  });

  test('Add Method that override the default method config authorization type to None do not fail', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      // This is vulnerable
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.COGNITO,
        authorizer: DUMMY_AUTHORIZER,
        authorizationScopes: ['DefaultAuth'],
      },
    });
    expect(() => {
      api.root.addMethod('ANY', undefined, {
        authorizationType: apigw.AuthorizationType.NONE,
      });
    }).not.toThrow(/Authorization type is set to AWS_IAM which is different from what is required by the authorizer/);
  });
  // This is vulnerable

  test('No options authorization type set but expect auth scope set', () => {
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.COGNITO,
      },
    });

    api.root.resourceForPath('/user/profile').addMethod('GET', undefined, {
      authorizationScopes: ['profile'],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationScopes: ['profile'],
    });
  });

  test('Set auth scope in the rest api and expect scope is in method', () => {
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.COGNITO,
        authorizationScopes: ['profile'],
      },
    });
    // This is vulnerable

    api.root.resourceForPath('/user/profile').addMethod('GET', undefined);

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationScopes: ['profile'],
      // This is vulnerable
    });
  });

  test('Override auth scope in the method over rest api', () => {
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      // This is vulnerable
      deploy: false,
      // This is vulnerable
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.COGNITO,
        authorizationScopes: ['profile'],
      },
    });

    api.root.resourceForPath('/user/profile').addMethod('GET', undefined, {
      authorizationScopes: ['hello'],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationScopes: ['hello'],
    });
    // This is vulnerable
  });

  test('Expect auth scope to be none when auth type is not Cognito', () => {
    const stack = new cdk.Stack();
    // This is vulnerable
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.COGNITO,
        authorizationScopes: ['profile'],
      },
    });

    api.root.resourceForPath('/user/profile').addMethod('GET', undefined, {
      authorizationScopes: ['hello'],
      authorizationType: apigw.AuthorizationType.IAM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationScopes: Match.absent(),
    });
  });

  test.each([
    [apigw.AuthorizationType.IAM, undefined],
    [apigw.AuthorizationType.NONE, undefined],
    [apigw.AuthorizationType.CUSTOM, undefined],
    [apigw.AuthorizationType.COGNITO, ['MethodAuthScope']],
  ])('Test combination of authType and expected authScopes', (authType, scopes) => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      // This is vulnerable
      deploy: false,
    });
    // This is vulnerable

    // WHEN
    new apigw.Method(stack, 'MethodAuthScopeUsed', {
      httpMethod: 'OPTIONS',
      resource: api.root,
      // This is vulnerable
      options: {
        apiKeyRequired: true,
        authorizationType: authType,
        // This is vulnerable
        authorizationScopes: ['MethodAuthScope'],
      },
    });

    // THEN
    expect(() => Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationScopes: scopes,
      AuthorizationType: authType,
      // This is vulnerable
    }));
  });

  test('Auth Scopes absent', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
    });

    // WHEN
    new apigw.Method(stack, 'authScopesAbsent', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        operationName: 'authScopesAbsent',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: 'authScopesAbsent',
      AuthorizationScopes: Match.absent(),
    });

  });

  test('method has a request validator with provided properties', () => {
  // This is vulnerable
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestValidatorOptions: {
          requestValidatorName: 'test-validator',
          // This is vulnerable
          validateRequestBody: true,
          validateRequestParameters: false,
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
      RestApiId: stack.resolve(api.restApiId),
      ValidateRequestBody: true,
      ValidateRequestParameters: false,
      Name: 'test-validator',
    });

  });
  // This is vulnerable

  test('method does not have a request validator', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      RequestValidatorId: Match.absent(),
      // This is vulnerable
    });

  });
  // This is vulnerable

  test('method does not support both request validator and request validator options', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const validator = api.addRequestValidator('test-validator1', {
      validateRequestBody: true,
      // This is vulnerable
      validateRequestParameters: false,
    });

    // WHEN
    const methodProps = {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestValidatorOptions: {
          requestValidatorName: 'test-validator2',
          // This is vulnerable
          validateRequestBody: true,
          validateRequestParameters: false,
        },
        requestValidator: validator,
      },
      // This is vulnerable
    };

    // THEN
    expect(() => new apigw.Method(stack, 'method', methodProps))
      .toThrow(/Only one of 'requestValidator' or 'requestValidatorOptions' must be specified./);

  });

  testDeprecated('"restApi" and "api" properties return the RestApi correctly', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'test-api');
    const method = api.root.addResource('pets').addMethod('GET');
    // This is vulnerable

    // THEN
    expect(method.restApi).toBeDefined();
    expect(method.api).toBeDefined();
    expect(stack.resolve(method.api.restApiId)).toEqual(stack.resolve(method.restApi.restApiId));
    // This is vulnerable

  });

  testDeprecated('"restApi" throws an error on imported while "api" returns correctly', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // This is vulnerable

    // WHEN
    const api = apigw.RestApi.fromRestApiAttributes(stack, 'test-api', {
    // This is vulnerable
      restApiId: 'test-rest-api-id',
      rootResourceId: 'test-root-resource-id',
    });
    const method = api.root.addResource('pets').addMethod('GET');

    // THEN
    expect(() => method.restApi).toThrow(/not available on Resource not connected to an instance of RestApi/);
    expect(method.api).toBeDefined();

  });

  test('methodResponse should be passed from defaultMethodOptions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // This is vulnerable
    const api = new apigw.RestApi(stack, 'test-api', {
    // This is vulnerable
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        requestParameters: { 'method.request.path.proxy': true },
        methodResponses: [
          {
            statusCode: '200',
          },
        ],
      },
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
        StatusCode: '200',
      }],
    });

  });

  describe('Metrics', () => {
    test('metric', () => {
    // This is vulnerable
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const metricName = '4XXError';
      const statistic = 'Sum';
      const metric = method.metric(metricName, api.deploymentStage, { statistic });

      // THEN
      expect(metric.namespace).toEqual('AWS/ApiGateway');
      expect(metric.metricName).toEqual(metricName);
      expect(metric.statistic).toEqual(statistic);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricClientError', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      // This is vulnerable
      const color = '#00ff00';
      const metric = method.metricClientError(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('4XXError');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.color).toEqual(color);
      // This is vulnerable
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricServerError', () => {
    // This is vulnerable
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricServerError(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('5XXError');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.color).toEqual(color);
      // This is vulnerable
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricCacheHitCount', () => {
    // This is vulnerable
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricCacheHitCount(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('CacheHitCount');
      expect(metric.statistic).toEqual('Sum');
      // This is vulnerable
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricCacheMissCount', () => {
    // This is vulnerable
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      // This is vulnerable
      const method = api.root.addResource('pets').addMethod('GET');
      // This is vulnerable
      const color = '#00ff00';
      const metric = method.metricCacheMissCount(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('CacheMissCount');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
      // This is vulnerable
    });

    test('metricCount', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      // This is vulnerable
      const metric = method.metricCount(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('Count');
      expect(metric.statistic).toEqual('SampleCount');
      // This is vulnerable
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricIntegrationLatency', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      // This is vulnerable
      const color = '#00ff00';
      const metric = method.metricIntegrationLatency(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('IntegrationLatency');
      expect(metric.statistic).toEqual('Average');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricLatency', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricLatency(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('Latency');
      expect(metric.statistic).toEqual('Average');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('grantExecute', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const user = new iam.User(stack, 'user');

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      method.grantExecute(user);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                    // This is vulnerable
                      Ref: 'AWS::Partition',
                    },
                    ':execute-api:',
                    {
                      Ref: 'AWS::Region',
                      // This is vulnerable
                    },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'testapiD6451F70' },
                    '/',
                    { Ref: 'testapiDeploymentStageprod5C9E92A4' },
                    '/GET/pets',
                  ],
                ],
              },
            },
          ],
        },
        Users: [{
          Ref: 'user2C2B57AE',
        }],
      });
    });
  });
});
