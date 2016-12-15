'use strict';
require('dotenv').config();
var libDb = require('../libhive-db');

let startOfTime = new Date(0, 0, 0);
let twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

libDb
  .lastProcessedValues.save('npm', twoDaysAgo.toISOString())
  .then(() => console.log('reset done', twoDaysAgo))
  .catch(err => console.error(err));

