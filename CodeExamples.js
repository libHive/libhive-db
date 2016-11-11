'use strict';
const TABLE_NAME = 'codeExamples';

class CodeExamples {
  constructor(dbClient) {
    this.dbClient = dbClient;
    this.save = this.save.bind(this);
  }

  save(codeExample) {
    console.log('saving code example');
    return this.dbClient.putItem({
      TableName: TABLE_NAME,
      Item: codeExample
    })
    .then(res => {
      return res.oldItem ? res : this.dbClient.updateItem({
        TableName: 'usageTypes',
        Key: { usageTypeKey: codeExample.usageTypeKey },
        ExpressionAttributeValues: { ':usedPackageKey': codeExample.usedPackageKey, ':zero': 0, ':one': 1 },
        UpdateExpression: 'SET examplesCount = if_not_exists(examplesCount, :zero) + :one, usagePackageKey = :usedPackageKey'
      }).then(() => res); // return res anyway
    })
    .catch(err => {
      console.error('Error saving usage example');
      console.error(err);
      throw err;
    });
  }

  // get(providerName) {
  //   console.log('Getting CodeExamples', providerName);

  //   return this.dbClient.getItem({
  //       TableName: TABLE_NAME,
  //       Key: { providerName }
  //     })
  //     .get('Item')
  //     .get('updated');
  // }

}

module.exports = CodeExamples;

