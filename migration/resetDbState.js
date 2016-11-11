'use strict';
var libDb = require('../libhive-db');

let startOfTime = new Date(0, 0, 0);
let twoHoursAgo = new Date();
twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

libDb
  .lastProcessedValues.save('npm', twoHoursAgo.toISOString())
  .then(() => console.log('reset done'))
  .catch(err => console.error(err));

