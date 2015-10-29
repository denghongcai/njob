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
  static parse(channel, message) {
    channel[0] = channel[0].toUpperCase();
    Parser[`parse${channel}Message`].apply(this, message);
  }

  static parseClientMessage(message) {
    switch (message.action) {
      case CONSTANTS.ACTION_QUERY_REGISTERED_JOB:
        this.emit('query registered job');
        break;
      case CONSTANTS.ACTION_QUERY_JOB_STATUS:
        this.emit('query job status', message.job.id);
        break;
      case CONSTANTS.ACTION_SEND_JOB:
        this.emit('receive job', message);
        break;
      case CONSTANTS.ACTION_REVOKE_JOB:
        this.emit('revoke job', message.job.id);
        break;
      default:
        this.emit('error', new ParserError('unknown action'));
        return;
    }
  }

  static parseServerMessage(message) {
    switch (message.action) {
      case CONSTANTS.ACTION_SEND_JOB:
        this.emit('receive job', message);
        break;
      case CONSTANTS.ACTION_QUERY_JOB_STATUS:
        this.emit('query job status', message.job.id);
        break;
      case CONSTANTS.ACTION_REVOKE_JOB:
        this.emit('revoke job', message.job.id);
        break;
      case CONSTANTS.ACTION_REFRESH:
        this.emit('error', new ParserError('action is not implemented'));
        break;
      default:
        this.emit('error', new ParserError('unknown action'));
        return;
    }
  }

  static parseWorkerMessage(message) {
    switch (message.event) {
      case CONSTANTS.EVENT_JOB_WAITING:
      case CONSTANTS.EVENT_JOB_PROCESSING:
      case CONSTANTS.EVENT_JOB_FAILURE:
      case CONSTANTS.EVENT_JOB_COMPLETED:
      case CONSTANTS.EVENT_JOB_REVOKED:
        this.emit('change job status', message.event.substring(2).toLowerCase());
        break;
      default:
        this.emit('error', new ParserError('unknown event'));
        return;
    }
  }
}