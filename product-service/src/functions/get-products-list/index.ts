import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        // authorizer: {
        //   name: 'cognitoAuthorizer',
        //   arn: '${cf:authorization-service-dev.cognitoUserPoolArn}',
        //   identitySource: 'method.request.header.Authorization',
        //   type: 'COGNITO_USER_POOLS',
        // },
      },
    },
  ],
};
