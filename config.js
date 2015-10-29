/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import _ from 'lodash';
import extendDeep from 'deep-extend';

/**
 * Config 类构造函数
 *
 * @constructor
 */
function Config() {
}

/**
 * 使用配置文件初始化配置
 *
 * @param {String} path 配置文件路径
 * @returns {undefined}
 */
Config.prototype.init = function(path) {
  let config = _.defaultsDeep(require(path), require('./config-default.json'));
  Object.keys(config).forEach(key => {
    this[key] = config[key];
  })
};

var config = new Config();

export default config;
