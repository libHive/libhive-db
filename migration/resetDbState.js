'use strict';
require('dotenv').config();
var libDb = require('../libhive-db');

let twoDaysAgo = new Date();
twoDaysAgo.setFullYear(2013);

libDb
  .lastProcessedValues.save('npm', twoDaysAgo.toISOString())
  .then(() => console.log('reset done', twoDaysAgo))
  .catch(err => console.error(err));

