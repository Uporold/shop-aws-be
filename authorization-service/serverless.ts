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
      uporold: process.env.uporold,
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { basicAuthorizer },
  resources: {
    Outputs: {
      basicAuthorizerArn: {
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
