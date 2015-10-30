#!/usr/bin/env node
/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import Server from './../modules/server';
import program from 'commander';
import config from './../config';
import {version} from '../../package.json';

program
  .version(version)
  .option('-c, --config <path>', 'Specify config path');

program
  .command('serve')
  .description('run server')
  .action(() => {
    if (program.config) {
      config.init(program.config);
    }
    new Server(config);
  });


program.parse(process.argv);
