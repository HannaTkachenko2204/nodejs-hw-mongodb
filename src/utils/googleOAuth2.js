// функція для генерації посилання
import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { readFile } from 'fs/promises';

import { env } from './env.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
  // новий екземпляр класу OAuth2Client, використовуючи дані з файлу google-oauth.json
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oauthConfig.web.redirect_uris[0], // URI, на який буде перенаправлено користувача після аутентифікації
});

export const generateAuthUrl = () =>
  // цей метод генерує URL для аутентифікації користувача за допомогою Google OAuth 2.0
  googleOAuthClient.generateAuthUrl({
    scope: [
      // вказує, які права доступу запитуються
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  // в полі response.tokens.id_token буде лежати jwt токен
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  // метод verifyIdToken з нашого клієнта для розшифровки jwt токен
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};
