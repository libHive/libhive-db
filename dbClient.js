'use strict';
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
const Q = require('q');
const _ = require('lodash');
const THROTTLE_DELAY = 1500;

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.LOCAL_DYNAMO
});
var awsClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new DOC.DynamoDB(awsClient);

function promisize(methodName) {
  return function(params) { return Q.ninvoke(docClient, methodName, params); };
}

let _putItem = promisize('putItem');
function putItem(params) {  
  _.extend(params.Item, { _createdAt: (new Date()).toISOString() });
  _.extend(params, { ReturnValues: 'ALL_OLD' });
  return _putItem(params)
    .then(res => ({ oldItem: res.Attributes }));
}

let tableBeingThrottled = {};

function setThrottle(tableName) {
  console.log('setting table throttle', tableName);
  tableBeingThrottled[tableName] = new Promise(resolve => {
    setTimeout(() => {
      tableBeingThrottled[tableName] = null;
      // console.log('throttle delay over', tableName);
      resolve();
    }, THROTTLE_DELAY);
  });
}

function throttle(func) {
  const throttledFunction = function(params) {
    const tableName = params.TableName;
    if (tableBeingThrottled[tableName]) {
      console.log('table being throttled', tableName);
      return tableBeingThrottled[tableName].then(() => throttledFunction(params));
    }
  
  return func(params)    
    .catch(err => {
      if (err.code === 'ProvisionedThroughputExceededException') {
        setThrottle(tableName);
        return tableBeingThrottled[tableName].then(() => throttledFunction(params));
      } else {
        throw err;
      }
    });
  }

  return throttledFunction;
}

let dbClient = {
  getItem: promisize('getItem'),
  putItem: throttle(putItem),
  updateItem: throttle(promisize('updateItem')),
  query: promisize('query'),
  docClient
};

module.exports = dbClient;
