import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: '${cf:authorization-service-dev.basicAuthorizerArn}',
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      },
    },
  ],
};
