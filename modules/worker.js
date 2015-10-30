/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import Broker from './brokers';
import CONSTANTS from './constants';
import log from './logger';

export default class Worker {
  constructor(config) {
    this.broker = Broker(config, 'worker');

    this.registeredJobs = new Map();
    this.activatedjobs = new Map();

    this.initEventListeners();
  }

  initEventListeners() {
    this.broker.on(CONSTANTS.EVENT_QUERY_JOB_STATUS, (id, respond) => {
      if (this.activatedjobs.has(id)) {
        let job = this.activatedjobs.get(id);
        respond({data: job.status}, 'client');
      }
    });

    this.broker.on(CONSTANTS.EVENT_RECEIVE_JOB, (message, respond) => {
      log.debug(message);
      if (this.registeredJobs.has(message.job.name)) {
        message.job.status = CONSTANTS.STATUS_JOB_WAITING.substring(2).toLowerCase();
        this.activatedjobs.set(message.job.id, message.job);
        this.process(message.job);
        respond(message);
      }
    });
  }

  registerJob(signature) {
    this.broker.registerJob(signature)
      .then(response => {
        log.debug(response);
      })
      .catch(err => {
        log.error(err);
      });
  }

  process(job) {
    let handler = this.registeredJobs.get(job.name).handler.bind(job);
    // observe job status
    Object.observe(job, changes => {
      changes.forEach(change => {
        if (change.name === 'status') {
          this.broker.updateJobStatus(change.object.id, change.object.status)
            .catch(err => {
              log.debug(err);
            });
        }
      });
    });

    job.status = CONSTANTS.STATUS_JOB_PROCESSING.substring(2).toLowerCase();
    this.activatedjobs.set(message.job.id, message.job);
    handler(job)
      .then(result => {
        log.debug(result);
        job.status = CONSTANTS.STATUS_JOB_COMPLETED.substring(2).toLowerCase();
        this.activatedjobs.set(message.job.id, message.job);
      })
      .catch(err => {
        log.debug(err);
        job.status = CONSTANTS.STATUS_JOB_FAILURE.substring(2).toLowerCase();
        this.activatedjobs.set(message.job.id, message.job);
      });
  }
}
