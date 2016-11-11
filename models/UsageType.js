'use strict';
const TABLE_NAME = 'usageTypes';

class UsageType {
  constructor(dbClient) {
    this.dbClient = dbClient;
    this.add = this.add.bind(this);
  }

  add(codeExample) {
    console.log('adding usage type');
    return this.dbClient.updateItem({
      TableName: 'usageTypes',
      Key: { usageTypeKey: codeExample.usageTypeKey },
      ExpressionAttributeValues: {
        ':usedPackageKey': codeExample.usedPackageKey,
        ':usageType': codeExample.usageType,
        ':zero': 0,
        ':one': 1
      },
      UpdateExpression: 'SET examplesCount = if_not_exists(examplesCount, :zero) + :one, usedPackageKey = :usedPackageKey, usageType = :usageType'
    });
  }

  find(usedPackageKey) {
    return this.dbClient.query({
      TableName: TABLE_NAME,
      IndexName: 'usageTypesByUsedPackageAndCount',
      KeyConditions: this.dbClient.docClient.Condition('usedPackageKey', 'EQ', usedPackageKey),
      ScanIndexForward: false, // start with higher scores
      Limit: 25
    })
    .then(res => res.Items);
  }
}

module.exports = UsageType;

