'use strict';
const _ = require('lodash');

const TABLE_NAME = 'packageInformation2';

function deleteAllEmpties(info) {
  _.each(info, (value,key) => {
    if(_.isArray(value) || _.isObject(value)) value = deleteAllEmpties(value);
    if(_.isEmpty(value)) {
      if (_.isArray(info)) info.splice(key, 1);
      else if (_.isObject(info)) delete info[key];
    }
  });

  return info;
}

class PackageInformation {

  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  save(info) {
  // TODO : validate
    info.packageName = info.provider + '-' + info.name;

    info = deleteAllEmpties(info);

    return this.dbClient.putItem({
      TableName: TABLE_NAME,
      Item: info
    })
    .catch(err => {
      console.error('error saving package information');
      console.error(err);
      throw err;
    });
  }

  get(provider, packageName) {
    return this.dbClient.getItem({
      TableName: TABLE_NAME,
      Key: { packageName: provider + '-' + packageName }
    });
  }

}

module.exports = PackageInformation;

