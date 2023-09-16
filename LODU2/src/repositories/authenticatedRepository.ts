import {
  get as basicGet,
  post as basicPost,
  put as basicPut,
  deleteMethod as basicDelete,
  StatusCodeError,
} from '../networking';
import {refresh} from './authentication.ts';
import SessionManager from '../managers/sessionManager';

export class MustLoginAgain extends Error {
  constructor() {
    super('Must login afresh again.');
    this.name = 'MustLoginAgain';
  }
}

export function post(
  url,
  body,
  queryParams = [],
  headers = {},
): Promise<Object> {
  const token = SessionManager.getInstance().getAuthToken();
  if (!token) {
    return Promise.reject(new MustLoginAgain());
  }
  return basicPost(url, body, queryParams, {
    ...headers,
    Authorization: `Bearer ${token}`,
  }).catch(error => {
    return reLogInIfNecessary(error).then(newToken => {
      return basicPost(url, body, queryParams, {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      });
    });
  });
}

export function get(url, queryParams = [], headers = {}): Promise<Object> {
  const token = SessionManager.getInstance().getAuthToken();
  if (!token) {
    return Promise.reject(new MustLoginAgain());
  }
  return basicGet(url, queryParams, {
    ...headers,
    Authorization: `Bearer ${token}`,
  }).catch(error => {
    return reLogInIfNecessary(error).then(newToken => {
      return basicGet(url, queryParams, {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      });
    });
  });
}

export function deleteMethod(
  url,
  body = null,
  queryParams = [],
  headers = {},
): Promise<Object> {
  const token = SessionManager.getInstance().getAuthToken();
  if (!token) {
    return Promise.reject(new MustLoginAgain());
  }
  return basicDelete(url, body, queryParams, {
    ...headers,
    Authorization: `Bearer ${token}`,
  }).catch(error => {
    return reLogInIfNecessary(error).then(newToken => {
      return basicDelete(url, queryParams, {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      });
    });
  });
}

export function put(
  url,
  body,
  queryParams = [],
  headers = {},
): Promise<Object> {
  const token = SessionManager.getInstance().getAuthToken();
  if (!token) {
    return Promise.reject(new MustLoginAgain());
  }
  return basicPut(url, body, queryParams, {
    ...headers,
    Authorization: `Bearer ${token}`,
  }).catch(error => {
    return reLogInIfNecessary(error).then(newToken => {
      return basicPut(url, body, queryParams, {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      });
    });
  });
}

function reLogInIfNecessary(error): Promise<string> {
  if (error instanceof StatusCodeError && error.code == 401) {
    const refreshToken = SessionManager.getInstance().getRefreshToken();
    if (refreshToken) {
      return refresh(refreshToken)
        .catch(async error => {
          if (error instanceof StatusCodeError && error.code == 401) {
            await SessionManager.getInstance().clearCredentials();
            return Promise.reject(new MustLoginAgain());
          }
          return Promise.reject(error);
        })
        .then(async json => {
          json.refresh = refreshToken;
          await SessionManager.getInstance().saveCredentials(json);
          return json.access;
        });
    }
    return Promise.reject(new MustLoginAgain());
  }
  return Promise.reject(error);
}

export default {post, get, put, deleteMethod, MustLoginAgain};
