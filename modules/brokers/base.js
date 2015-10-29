/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import EventEmitter from 'events';
import * as CONSTANTS from '../constants';

export default

class Broker extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
  }

  refresh() {
    let message = {
      action: CONSTANTS.ACTION_REFRESH
    };
    return this.publish(message, 'worker');
  }

  registerJob(signature) {
    let message = {
      action: CONSTANTS.ACTION_REGISTER_JOB,
      job: signature
    };
    return this.publish(message, 'server');
  }

  queryRegisteredJob() {
    let message = {
      action: CONSTANTS.ACTION_QUERY_REGISTERED_JOB
    };
    return this.publish(message, 'server');
  }

  sendJob(signature) {
    let message = {
      action: CONSTANTS.ACTION_SEND_JOB,
      job: signature
    };
    switch (this.role) {
      case 'client':
        return this.publish(message, 'server');
      case 'server':
        return this.publish(message, 'worker');
    }
  }

  queryJobStatus(id) {
    let message = {
      action: CONSTANTS.ACTION_QUERY_JOB_STATUS,
      job: {
        id: id
      }
    };
    switch (this.role) {
      case 'client':
        return this.publish(message, 'server');
      case 'server':
        return this.publish(message, 'worker');
    }
  }

  updateJobStatus(id, status) {
    let message = {
      event: status,
      job: {
        id: id
      }
    };
    switch (this.role) {
      case 'worker':
        return this.publish(message, 'server');
      case 'server':
        return this.publish(message, 'client');
    }
  }

  revokeJob(id) {
    let message = {
      action: CONSTANTS.ACTION_REVOKE_JOB,
      job: {
        id: id
      }
    };
    switch (this.role) {
      case 'client':
        return this.publish(message, 'server');
      case 'server':
        return this.publish(message, 'worker');
    }
  }
}