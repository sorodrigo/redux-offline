// @flow
/* global fetch */

import type { OfflineAction } from '../types';

export function NetworkError(response: {} | string, status: number) {
  this.name = 'NetworkError';
  this.status = status;
  this.response = response;
}

// $FlowFixMe
NetworkError.prototype = Error.prototype;
NetworkError.prototype.status = null;

const isJSON = (json: string): ?boolean => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};

const tryParseJSON = (json: string): ?{} => {
  if (!json) {
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error(`Failed to parse unexpected JSON response: ${json}`);
  }
};

const getResponseBody = (res: any): Promise<{} | string> => {
  const contentType = res.headers.get('content-type') || false;
  if (contentType && contentType.indexOf('json') >= 0) {
    return res.text().then(tryParseJSON);
  }
  return res.text();
};

// eslint-disable-next-line no-unused-vars
export default (effect: any, _action: OfflineAction): Promise<any> => {
  const { url, ...options } = effect;
  const body = isJSON(options.body) // TODO backwards compatibility, deprecate
    ? options.body
    : JSON.stringify(options.body);
  const headers = { 'content-type': 'application/json', ...options.headers };
  return fetch(url, { ...options, body, headers }).then(res => {
    if (res.ok) {
      return getResponseBody(res);
    }
    return getResponseBody(res).then(responseBody => {
      throw new NetworkError(responseBody || '', res.status);
    });
  });
};
