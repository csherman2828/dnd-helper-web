const COGNITO_URL = 'https://cognito-idp.us-east-1.amazonaws.com';
const CLIENT_ID = '6pgtorp3ov46ltjlodi1q0e216';

enum CognitoMethod {
  InitiateAuth = 'InitiateAuth',
  RefreshAuth = 'RefreshAuth',
}

async function sendCognitoRequest({
  method,
  body,
}: {
  method: CognitoMethod;
  body: object | string;
}) {
  const stringifiedBody =
    typeof body === 'string' ? body : JSON.stringify(body);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${method}`,
    },
    body: stringifiedBody,
  };

  return fetch(COGNITO_URL, options);
}

export async function initiateAuth(username: string, password: string) {
  return sendCognitoRequest({
    method: CognitoMethod.InitiateAuth,
    body: {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    },
  });
}

export async function refreshAuth(refreshToken: string) {
  return sendCognitoRequest({
    method: CognitoMethod.InitiateAuth,
    body: {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    },
  });
}
