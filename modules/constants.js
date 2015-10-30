/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

export const ACTION_REGISTER_JOB = 'registerJob';
export const ACTION_QUERY_REGISTERED_JOB = 'queryRegisteredJob';
export const ACTION_GET_JOBS = 'getJobs';
export const ACTION_SEND_JOB = 'sendJob';
export const ACTION_QUERY_JOB_STATUS = 'queryJobStatus';
export const ACTION_REVOKE_JOB = 'revokeJob';
export const ACTION_REFRESH = 'refresh';

export const STATUS_JOB_QUEUED = 'jobQueued';
export const STATUS_JOB_WAITING = 'jobWaiting';
export const STATUS_JOB_PROCESSING = 'jobProcessing';
export const STATUS_JOB_FAILURE = 'jobFailure';
export const STATUS_JOB_COMPLETED = 'jobCompleted';
export const STATUS_JOB_REVOKED = 'jobRevoked';

export const EVENT_GET_JOBS = 'get jobs';
export const EVENT_QUERY_REGISTERED_JOB = 'query registered job';
export const EVENT_QUERY_JOB_STATUS = 'query job status';
export const EVENT_RECEIVE_JOB = 'receive job';
export const EVENT_REVOKE_JOB = 'revoke job';
export const EVENT_UPDATE_JOB_STATUS = 'update job status';

