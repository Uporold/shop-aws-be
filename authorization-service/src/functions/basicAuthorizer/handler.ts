import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

const generatePolicy = (principalId, effect, resource) => {
  const authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

const basicAuthorizer = async (event, _context, callback) => {
  console.log(`Event: ${JSON.stringify(event)}`);
  if (event.type !== 'TOKEN') callback('Unauthorized');

  const token = event.authorizationToken.replace('Basic', '');
  const plainCreds = Buffer.from(token, 'base64').toString().split(':');
  const [username, password] = plainCreds;

  console.log(`Username: ${username}, password: ${password}`);

  const storedPassword = process.env[username];
  console.log(process.env.uporold);
  console.log(`Stored password: ${storedPassword}`);

  const permission =
    storedPassword && storedPassword === password ? 'Allow' : 'Deny';
  console.log(`Permission: ${permission}`);

  switch (permission) {
    case 'Allow':
      callback(null, generatePolicy(token, permission, event.methodArn));
      break;
    case 'Deny':
      callback(null, generatePolicy(token, permission, event.methodArn));
      break;
    default:
      callback('Error: Invalid token');
  }
};

export const main = middyfy(basicAuthorizer);
