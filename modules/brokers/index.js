/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import url from 'url';

export default function(config, role) {
  let urlObject = url.parse(config.broker);
  let Broker = require(`./${urlObject.protocol.slice(0, -1)}`);
  let broker = new Broker(role, config.broker);
  if (role === 'server') {
    let ApiBroker = require('./http');
    let apiBroker = new ApiBroker(role);
    apiBroker.on('*', function(...args) {
      broker.emit(this.event, ...args);
    });
  }
  return broker;
};