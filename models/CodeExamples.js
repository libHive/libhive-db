'use strict';
const UsageType = require('./UsageType');
const TABLE_NAME = 'codeExamples';

class CodeExamples {
  constructor(dbClient) {
    this.dbClient = dbClient;
    this.usageType = new UsageType(dbClient);
    this.save = this.save.bind(this);
  }

  save(codeExample) {
    console.log('saving code example');
    return this.dbClient.putItem({
      TableName: TABLE_NAME,
      Item: codeExample
    })
    .then(res => {
      // TODO: Aggregation should really be a dynamo db trigger - so deletes are also handled
      return res.oldItem ?
        res :
        this.usageType.add(codeExample).then(() => res); // return res anyway
    })
    .catch(err => {
      console.error('Error saving usage example');
      console.error(err);
      throw err;
    });
  }

  getByUsageType(usageTypeKey) {
    return this.dbClient.query({
      TableName: TABLE_NAME,
      IndexName: 'codeExamplesByTypeAndScore',
      KeyConditions: this.dbClient.docClient.Condition('usageTypeKey', 'EQ', usageTypeKey),
      ScanIndexForward: false, // start with higher scores
      Limit: 25
    })
    .then(res => res.Items);
  }

}

module.exports = CodeExamples;

