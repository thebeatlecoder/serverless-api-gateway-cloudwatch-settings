'use strict';

const get = require('lodash.get');
const REST_API_ID_KEY = 'RestApiIdForApigCwSettings';

const outputRestApiIdTo = (serverless) => {
  const configuredRestApiId = get(serverless, 'service.provider.apiGateway.restApiId');
  const autoGeneratedRestApiId = { Ref: 'ApiGatewayRestApi' };

  serverless.service.provider.compiledCloudFormationTemplate.Outputs[REST_API_ID_KEY] = {
    Description: 'REST API ID',
    Value: configuredRestApiId || autoGeneratedRestApiId,
  };
};

const retrieveRestApiId = async (serverless, settings) => {
  const stackName = serverless.providers.aws.naming.getStackName(settings.stage);

  const cloudFormation = await serverless.providers.aws.request('CloudFormation', 'describeStacks', { StackName: stackName },
    settings.stage,
    settings.region
  );
  const outputs = cloudFormation.Stacks[0].Outputs;
  const restApiKey = outputs.find(({ OutputKey }) => OutputKey === REST_API_ID_KEY).OutputValue;

  return restApiKey;
};

module.exports = {
  outputRestApiIdTo,
  retrieveRestApiId
};
