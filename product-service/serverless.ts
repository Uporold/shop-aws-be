import type { AWS } from '@serverless/typescript';
import {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess,
} from '@functions/index';
import dotenv from 'dotenv';
dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: { forceInclude: ['pg'] },
    },
  },
  useDotenv: true,
  plugins: ['serverless-webpack', 'serverless-offline'],
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
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
};

module.exports = serverlessConfiguration;
