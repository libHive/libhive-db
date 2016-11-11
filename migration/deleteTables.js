var dynamodb = require('../dbClient').db;
var tables = require('./tablesDefinition.json');

function cb(err, data) {
    if (err) console.error("Unable to delete table. Error JSON:", err);
    else console.log("deleted table. Table description JSON:", data);
}

if (false) { // !!! make sure dbClient is pointed at the local db or whatever you really mean !
  tables
    .map(table => ({ TableName: table.TableName }))
    .forEach(table => dynamodb.deleteTable(table, cb));
}
else {
  console.log('I wont work like this');
}
