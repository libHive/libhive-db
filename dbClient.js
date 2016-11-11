'use strict';
var AWS = require("aws-sdk");
var DOC = require("dynamodb-doc");

AWS.config.update({
  "region": "eu-west-1"
  // ,"endpoint": "http://localhost:8008" // for local development !
});

var awsClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new DOC.DynamoDB(awsClient);

module.exports = {
  db: awsClient,
  documentClient : docClient
};
