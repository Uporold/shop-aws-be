import type { AWS } from '@serverless/typescript';
import dotenv from 'dotenv';
dotenv.config();
import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  useDotenv: true,
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      USER_POOL_NAME: process.env.USER_POOL_NAME,
      USER_POOL_CLIENT_NAME: process.env.USER_POOL_CLIENT_NAME,
      USER_POOL_DOMAIN: process.env.USER_POOL_DOMAIN,
      uporold: process.env.uporold,
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { basicAuthorizer },
  resources: {
    Resources: {
      CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UserPoolName: process.env.USER_POOL_NAME,
          AliasAttributes: ['email'],
          AutoVerifiedAttributes: ['email'],
          UsernameConfiguration: {
            CaseSensitive: false,
          },
          AccountRecoverySetting: {
            RecoveryMechanisms: [
              {
                Name: 'verified_email',
                Priority: 1,
              },
            ],
          },
          Schema: [
            {
              Name: 'email',
              Required: true,
            },
          ],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6,
            },
          },
        },
      },
      CognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: process.env.USER_POOL_CLIENT_NAME,
          GenerateSecret: false,
          CallbackURLs: ['https://d2rqboly45oeob.cloudfront.net/'],
          AllowedOAuthScopes: [
            'phone',
            'email',
            'openid',
            'profile',
            'aws.cognito.signin.user.admin',
          ],
          AllowedOAuthFlows: ['implicit'],
          AllowedOAuthFlowsUserPoolClient: true,
          SupportedIdentityProviders: ['COGNITO'],
          UserPoolId: {
            Ref: 'CognitoUserPool',
          },
        },
      },
      CognitoUserPoolDomain: {
        Type: 'AWS::Cognito::UserPoolDomain',
        Properties: {
          Domain: process.env.USER_POOL_DOMAIN,
          UserPoolId: {
            Ref: 'CognitoUserPool',
          },
        },
      },
    },
    Outputs: {
      basicAuthorizerArn: {
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'],
        },
      },
      cognitoUserPoolArn: {
        Value: {
          'Fn::GetAtt': ['CognitoUserPool', 'Arn'],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
