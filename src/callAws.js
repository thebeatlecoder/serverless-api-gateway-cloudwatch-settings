'use strict';

const empty = require('lodash.isempty');
const pluginName = require('./pluginName');
const { retrieveRestApiId } = require('./restApiId');
const DEFAULT_LOG_LEVEL = 'OFF';

const createPatchOperationsBasedOn = (settings) => {
  return [
    {
      op: 'replace',
      path: '/*/*/metrics/enabled',
      value: `${settings.metricsEnabled}`
    },
    {
      op: 'replace',
      path: '/*/*/logging/loglevel',
      value: DEFAULT_LOG_LEVEL
    },
  ];
};

const toUpdateApiStage = async (serverless, settings) => {
  if (empty(settings)) {
    return;
  }
  const restApiId = await retrieveRestApiId(serverless, settings);
  const patchOperations = createPatchOperationsBasedOn(settings);

  const apiGateway = new AWS.APIGateway();
  const request = { restApiId, stageName: settings.stage, patchOperations };

  serverless.cli.log(`[${pluginName}] Updating API Gateway CloudWatch settings...`);
  await apiGateway.updateStage(request).promise();
  await serverless.providers.aws.request('APIGateway', 'updateStage', request, settings.stage, settings.region);
  serverless.cli.log(`[${pluginName}] Finished updating API Gateway CloudWatch settings.`);
};

module.exports = {
  toUpdateApiStage
};
