'use strict';
const zlib = require('zlib');
const TABLE_NAME = 'sourceFiles';

class SourceFiles {
  constructor(dbClient) {
    this.dbClient = dbClient;
    this.add = this.add.bind(this);
  }

  add(fileFullName, fileContents, metadata) {
    console.log('adding source file');

    const item = {
      fileFullName,
      fileContents: zlib.gzipSync(fileContents)
    };
    
    Object.assign(item, metadata);

    return this.dbClient.putItem({
      TableName: TABLE_NAME,
      Item: item
    });
  }

  get(fileFullName) {
    return this.dbClient.getItem({
      TableName: TABLE_NAME,
      Key: { fileFullName }
    })
    .then(res => {
      console.log(res);
    });
  }
}

module.exports = SourceFiles;

