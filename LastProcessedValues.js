'use strict';
const TABLE_NAME = 'lastProcessedValues2';

class LastProcessValues {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  save(providerName, updated) {
    return this.dbClient.putItem({
      TableName: TABLE_NAME,
      Item: {
        providerName,
        updated
      }
    })
    .catch(err => {
      console.error('Error saving last proceessed value');
      console.error(err);
      throw err;
    });
  }

  get(providerName) {
    console.log('Getting LastProcessValues', providerName);

    return this.dbClient.getItem({
        TableName: TABLE_NAME,
        Key: { providerName }
      })
      .get('Item')
      .get('updated');
  }

}

module.exports = LastProcessValues;

