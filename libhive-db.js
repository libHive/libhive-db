'use strict';
const dbClient = require('./dbClient');

const LastProcessedValues = require('./models/LastProcessedValues');
const PackageInformation = require('./models/PackageInformation');
const CodeExamples = require('./models/CodeExamples');
const UsageType = require('./models/UsageType');
const SourceFiles = require('./models/SourceFiles');

module.exports = {
  lastProcessedValues: new LastProcessedValues(dbClient),
  packageInformation: new PackageInformation(dbClient),
  codeExamples: new CodeExamples(dbClient),
  usageType: new UsageType(dbClient),
  sourceFiles: new SourceFiles(dbClient)
};
