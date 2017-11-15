// @flow

import type { OfflineAction } from '../types';
import { NetworkError } from './effect';

export default (
  error: NetworkError,
  action: OfflineAction,
  _retries: number = 0 // eslint-disable-line no-unused-vars
): boolean => {
  // no error -> don't discard
  if (!error) {
    return false;
  }
  // not a network error -> discard
  if (error.status == null) {
    return true;
  }

  // discard http 4xx errors
  // $FlowFixMe
  return error.status >= 400 && error.status < 500;
};
