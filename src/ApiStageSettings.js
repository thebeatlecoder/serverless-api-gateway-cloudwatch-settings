'use strict';

const get = require('lodash.get');

class ApiStageSettings {
  constructor(serverless, options) {
    const config = get(serverless, 'service.custom.apiGatewayCloudWatchSettings');
    
    if (!config) {
      return;
    }
    const { provider } = serverless.service;

    this.metricsEnabled = config.metricsEnabled || false;    
    this.stage = options ? options.stage : provider.stage;
    this.region = options ? options.region : provider.region;
  }
}

module.exports = ApiStageSettings;
