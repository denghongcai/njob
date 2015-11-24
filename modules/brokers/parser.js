/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import {ParserError} from '../error';
import * as CONSTANTS from '../CONSTANTS';

export default

class Parser {
  static parse(channel, message, respond) {
    channel[0] = channel[0].toUpperCase();
    Parser[`parse${channel}Message`].apply(this, message, respond);
  }

  static parseClientMessage(message, respond) {
    switch (message.status) {
      case CONSTANTS.STATUS_JOB_WAITING:
      case CONSTANTS.STATUS_JOB_PROCESSING:
      case CONSTANTS.STATUS_JOB_FAILURE:
      case CONSTANTS.STATUS_JOB_COMPLETED:
      case CONSTANTS.STATUS_JOB_REVOKED:
        this.emit(CONSTANTS.EVENT_UPDATE_JOB_STATUS, message.status.substring(2).toLowerCase(), respond);
        break;
      default:
        this.emit('error', new ParserError('unknown status'));
        return;
    }
  }

  static parseServerMessage(message, respond) {
    switch (message.action) {
      case CONSTANTS.ACTION_REGISTER_JOB:
        this.emit(CONSTANTS.EVENT_REGISTER_JOB, message, respond);
        break;
      case CONSTANTS.ACTION_QUERY_REGISTERED_JOB:
        this.emit(CONSTANTS.EVENT_QUERY_REGISTERED_JOB, respond);
        break;
      case CONSTANTS.ACTION_GET_JOBS:
        this.emit(CONSTANTS.EVENT_GET_JOBS, respond);
        break;
      case CONSTANTS.ACTION_SEND_JOB:
        this.emit(CONSTANTS.EVENT_RECEIVE_JOB, message, respond);
        break;
      case CONSTANTS.ACTION_QUERY_JOB_STATUS:
        this.emit(CONSTANTS.EVENT_QUERY_JOB_STATUS, message.job.id, respond);
        break;
      case CONSTANTS.ACTION_REVOKE_JOB:
        this.emit(CONSTANTS.EVENT_REVOKE_JOB, message.job.id, respond);
        break;
      case CONSTANTS.ACTION_REFRESH:
        this.emit('error', new ParserError('action is not implemented'));
        break;
      default:
        this.emit('error', new ParserError('unknown action'));
        return;
    }
  }

  static parseWorkerMessage(message, respond) {
    if (typeof message.action !== 'undefined') {
      switch (message.action) {
        case CONSTANTS.ACTION_SEND_JOB:
          this.emit(CONSTANTS.EVENT_RECEIVE_JOB, message, respond);
          break;
        case CONSTANTS.ACTION_QUERY_JOB_STATUS:
          this.emit(CONSTANTS.EVENT_QUERY_JOB_STATUS, message.job.id, respond);
          break;
        case CONSTANTS.ACTION_REVOKE_JOB:
          this.emit(CONSTANTS.EVENT_REVOKE_JOB, message.job.id, respond);
          break;
        default:
          this.emit('error', new ParserError('unknown action'));
          return;
      }
    }
    else if (typeof message.status !== 'undefined') {
      switch (message.status) {
        case CONSTANTS.STATUS_JOB_WAITING:
        case CONSTANTS.STATUS_JOB_PROCESSING:
        case CONSTANTS.STATUS_JOB_FAILURE:
        case CONSTANTS.STATUS_JOB_COMPLETED:
        case CONSTANTS.STATUS_JOB_REVOKED:
          message.status = message.status.substring(2).toLowerCase();
          this.emit(CONSTANTS.EVENT_UPDATE_JOB_STATUS, message.job.id, message.status);
          break;
        default:
          this.emit('error', new ParserError('unknown status'));
          return;
      }
    }
  }
}