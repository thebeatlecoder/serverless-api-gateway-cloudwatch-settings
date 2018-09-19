'use strict';

const AWS = require('aws-sdk');
const empty = require('lodash.isEmpty');
const { retrieveRestApiId } = require('./restApiId');
const PLUGIN_NAME = 'serverless-api-gateway-cloudwatch-settings';

const createPatchOperationsBasedOn = (settings) => {
  return [{
    op: 'replace',
    path: '/*/*/metrics/enabled',
    value: `${settings.metricsEnabled}`
  }];
};

const toUpdateApiStage = async (serverless, settings) => {
  if (empty(settings)) {
    return;
  }
  AWS.config.update({ region: settings.region });

  const restApiId = await retrieveRestApiId(serverless, settings);
  const stageName = settings.stage;
  const patchOperations = createPatchOperationsBasedOn(settings);

  const apiGateway = new AWS.APIGateway();
  const request = { restApiId, stageName, patchOperations };

  serverless.cli.log(`[${PLUGIN_NAME}] Updating API Gateway CloudWatch settings...`);
  await apiGateway.updateStage(request).promise();
  serverless.cli.log(`[${PLUGIN_NAME}] Finished updating API Gateway CloudWatch settings.`);
};


module.exports = {
  toUpdateApiStage
};
