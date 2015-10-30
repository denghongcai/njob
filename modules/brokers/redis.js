/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import Redis from 'ioredis';
import TimeoutCallback from 'timeout-callback';
import UUID from 'node-uuid';
import log from '../logger';
import Broker from './base';
import Parser from './parser';

export default

class RedisBroker extends Broker {
  constructor(role, url) {
    super(url);

    this.redisSub = new Redis(this.url);
    this.redis = new Redis(this.url);

    process.nextTick(() => {
      this.redisSub.subscribe(`njob-${role}`, err => {
        if (err) {
          this.emit('error', err);
        }
      });
      this.redisSub.on('message', (channel, message) => {
        this.emit(message.uuid, JSON.parse(message));
        Parser.parse.call(this, channel.substring(4), message, this.respondWrap(message.uuid));
      });
    });
  }

  publish(message, channel) {
    channel = `njob-${channel}`;
    message.uuid = UUID.v1();
    return new Promise((resolve, reject) => {
      this.redis.publish(channel, JSON.stringify(message));
      let callback = TimeoutCallback(3000, (err, message) => {
        if (err) {
          reject(err);
        }
        resolve(message);
      });
      this.once(message.uuid, callback);
    });
  }

  respondWrap(uuid) {
    return (message, channel) => {
      message.uuid = uuid;
      channel = `njob-${channel}`;
      this.redis.publish(channel, JSON.stringify(message));
    }
  }
}