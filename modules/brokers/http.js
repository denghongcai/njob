/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import TimeoutCallback from 'timeout-callback';
import UUID from 'node-uuid';
import express from 'express';
import bodyParser from 'body-parser';
import URL from 'url';
import log from '../logger';
import Broker from './base';
import Parser from './parser';
import * as CONSTANTS from '../constants';

export default
class HttpBroker extends Broker {
  constructor(role = 'server', url = 'http://127.0.0.1:3000') {
    super(url);

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use((req, res, next) => {
      if (!req.is('json')) {
        res.status(415).end();
      }
      else {
        next();
      }
    });

    this.app.post('job', (req, res) => {
      Parser.parse.call(this, role, req.body, this.respondWrap(res));
    });

    this.app.get('job/:id', (req, res) => {
      let message = {action: undefined, job: {id: req.params.id}};
      switch (req.query.q) {
        case CONSTANTS.ACTION_QUERY_JOB_STATUS:
          message.action = CONSTANTS.ACTION_QUERY_JOB_STATUS;
          break;
        case CONSTANTS.ACTION_REVOKE_JOB:
          message.action = CONSTANTS.ACTION_REVOKE_JOB;
          break;
      }
      Parser.parse.call(this, role, message, this.respondWrap(res));
    });

    this.app.get('job', (req, res) => {
      let message = {action: undefined};
      switch (req.query.q) {
        case CONSTANTS.ACTION_QUERY_REGISTERED_JOB:
          message.action = CONSTANTS.ACTION_QUERY_REGISTERED_JOB;
          break;
      }
      Parser.parse.call(this, role, message, this.respondWrap(res));
    });

    url = URL.parse(url);
    let port = url.port || 3000;

    this.app.listen(port, url.hostname);
    log.info(`listen on port ${port}`);
  }

  respondWrap(res) {
    return (data) => {
      res.json(data).end();
    }
  }
}
