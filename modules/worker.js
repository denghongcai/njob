/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import Broker from './brokers';
import log from './logger';

export default class Worker {
  constructor(config) {
    this.broker = Broker(config, 'worker');
  }
}
