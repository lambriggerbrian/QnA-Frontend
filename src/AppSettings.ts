export const server = `https://localhost:44348`;

export const webAPIUrl = `${server}/api`;

export const authSettings = {
  domain: 'dev-sunsh1n3.us.auth0.com',
  client_id: 'r2C6O5zpG6nsj2uDsy0vqRdFleqFbQql',
  redirect_uri: window.location.origin + '/signin-callback',
  scope: 'openid profile QnAAPI email',
  audience: 'https://qna',
};
