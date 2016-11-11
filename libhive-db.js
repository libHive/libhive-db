"use strict";
const Q = require('q');
const _ = require('lodash');
const assert = require('assert');
const docClient = require('./dbClient').documentClient;
// const logger = require('libhive-common').getLogger(module);

function promisize(methodName) {
  return function(params) { return Q.ninvoke(docClient, methodName, params); };
}

let _putItem = promisize('putItem');
// let query = promisize('query');
// let batchGetItem = promisize('batchGetItem');

function putItem(params) {
  _.extend(params.Item, { _createdAt: (new Date()).toISOString() });
  _.extend(params, { ReturnValues: 'ALL_OLD' });
  return _putItem(params)
    .then(res => ({ oldItem: res.Attributes }));
}

// refactoring
const LastProcessedValues = require('./LastProcessedValues');
const PackageInformation = require('./PackageInformation');
const CodeExamples = require('./CodeExamples');

let dbClient = {
  getItem: promisize('getItem'),
  putItem,
  updateItem: promisize('updateItem')
};

module.exports = {
  lastProcessedValues: new LastProcessedValues(dbClient),
  packageInformation: new PackageInformation(dbClient),
  codeExamples: new CodeExamples(dbClient)
};
