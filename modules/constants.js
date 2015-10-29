/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

export const ACTION_REGISTER_JOB = 'registerJob';
export const ACTION_QUERY_REGISTERED_JOB = 'queryRegisteredJob';
export const ACTION_SEND_JOB = 'sendJob';
export const ACTION_QUERY_JOB_STATUS = 'queryJobStatus';
export const ACTION_REVOKE_JOB = 'revokeJob';
export const ACTION_REFRESH = 'refresh';

export const EVENT_JOB_WAITING = 'jobWaiting';
export const EVENT_JOB_PROCESSING = 'jobProcessing';
export const EVENT_JOB_FAILURE = 'jobFailure';
export const EVENT_JOB_COMPLETED = 'jobCompleted';
export const EVENT_JOB_REVOKED = 'jobRevoked';

