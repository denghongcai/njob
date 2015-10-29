/*
 * Copyright (C) 2015 <Hongcai Deng>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

import config from '../config';
import {colorConsole} from 'tracer';

export default colorConsole(config.log);
