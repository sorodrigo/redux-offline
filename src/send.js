import { busy, scheduleRetry } from './actions';
import { JS_ERROR } from './constants';
import { resolveAction, rejectAction } from './offlineActionTracker';
import type { Config, OfflineAction, ResultAction } from './types';

const complete = (
  action: ResultAction,
  success: boolean,
  payload: {},
  offlineAction: OfflineAction
): ResultAction => {
  if (success) {
    resolveAction(offlineAction.meta.transaction, payload);
  } else {
    rejectAction(offlineAction.meta.transaction, payload);
  }
  return {
    ...action,
    payload,
    meta: { ...action.meta, success, completed: true }
  };
};

const send = (action: OfflineAction, dispatch, config: Config, retries = 0) => {
  const metadata = action.meta.offline;
  dispatch(busy(true));
  return config
    .effect(metadata.effect, action)
    .then(result => {
      try {
        return dispatch(complete(metadata.commit, true, result, action));
      } catch (e) {
        console.error(e);
        return dispatch(complete({ type: JS_ERROR }, false, e, action));
      }
    })
    .catch(error => {
      // discard
      if (config.discard(error, action, retries)) {
        console.info('Discarding action', action.type);
        return dispatch(complete(metadata.rollback, false, error, action));
      }
      const delay = config.retry(action, retries);
      if (delay != null) {
        console.info('Retrying action', action.type, 'with delay', delay);
        return dispatch(scheduleRetry(delay));
      }
      console.info(
        'Discarding action',
        action.type,
        'because retry did not return a delay'
      );
      return dispatch(complete(metadata.rollback, false, error, action));
    });
};

export default send;
