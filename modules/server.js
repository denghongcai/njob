/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import Broker from './brokers';
import log from './logger';
import * as CONSTANTS from './constants';

export default class Server {
  constructor(config) {
    this.broker = Broker(config, 'server');
    this.broker.refresh().catch(err => {
      log.error(err.stack);
    });

    this.registeredJobs = new Map();
    this.activatedJobs = new Map();

    this.initEventListeners();
  }

  initEventListeners() {
    this.broker.on(CONSTANTS.EVENT_REGISTER_JOB, (message, respond) => {
      let signature = message.job;
      this.registeredJobs.set(signature.name, signature);
      respond(message, 'worker');
      log.debug(`registerd job "${signature.name}"`);
    });

    this.broker.on(CONSTANTS.EVENT_QUERY_JOB_STATUS, (id, respond) => {
      this.broker.queryJobStatus(id)
        .then(message => {
          respond(message, 'client');
          log.debug(message);
        })
        .catch(err => {
          log.error(err);
        });
    });

    this.broker.on(CONSTANTS.EVENT_QUERY_REGISTERED_JOB, respond => {
      respond({data: [...this.registeredJobs]}, 'client');
      log.debug([...this.registeredJobs])
    });

    this.broker.on(CONSTANTS.EVENT.EVENT_GET_JOBS, respond => {
      respond({data: [...this.activatedJobs]}, 'client');
      log.debug([...this.activatedJobs]);
    });

    this.broker.on(CONSTANTS.EVENT_RECEIVE_JOB, (message, respond) => {
      log.debug(message);
      if (this.registeredJobs.has(message.job.name)) {
        this.broker.sendJob(message.job)
          .then(message => {
            this.activatedJobs.set(message.job.id, message.job);
            respond(message, 'client');
            log.debug(message);
          })
          .catch(err => {
            log.error(err);
          });
      }
    });

    this.broker.on(CONSTANTS.EVENT_REVOKE_JOB, (id, respond) => {
      this.broker.revokeJob(id)
        .then(message => {
          respond(message, 'client');
          log.debug(message);
        })
        .catch(err => {
          log.error(err);
        });
    });

    this.broker.on(CONSTANTS.EVENT_UPDATE_JOB_STATUS, message => {
      let job = this.activatedJobs.get(message.job.id);
      job.status = message.status;
      this.activatedJobs.set(job.id, job);
    });
  }
}
