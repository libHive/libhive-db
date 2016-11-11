'use strict';
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
const Q = require('q');
const _ = require('lodash');

AWS.config.update({
  'region': 'eu-west-1'
  // ,"endpoint": "http://localhost:8008" // for local development !
});

var awsClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new DOC.DynamoDB(awsClient);

function promisize(methodName) {
  return function(params) { return Q.ninvoke(docClient, methodName, params); };
}

// let batchGetItem = promisize('batchGetItem');

let _putItem = promisize('putItem');
function putItem(params) {
  _.extend(params.Item, { _createdAt: (new Date()).toISOString() });
  _.extend(params, { ReturnValues: 'ALL_OLD' });
  return _putItem(params)
    .then(res => ({ oldItem: res.Attributes }));
}

let dbClient = {
  getItem: promisize('getItem'),
  putItem,
  updateItem: promisize('updateItem'),
  query: promisize('query'),

  docClient
};

module.exports = dbClient;
