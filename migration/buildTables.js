'use strict';
require('dotenv').config();
var dynamodb = require('../dbClient').docClient;
var tables = require('./tablesDefinition.json');

tables
  .forEach(table => dynamodb.createTable(table, function cb(err, data) {
    console.log('********************', table.TableName);
    if (err) console.error("Unable to create table. Error JSON:", err);
    else console.log("Created table. Table description JSON:", data);
  }));
