'use strict';

const empty = require('lodash.isempty');
const ApiStageSettings = require('./ApiStageSettings');
const pluginName = require('./pluginName');
const callAws = require('./callAws');
const { outputRestApiIdTo } = require('./restApiId');

class Plugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'before:package:initialize': this.createSettings.bind(this),
      'before:package:finalize': this.interceptRestApiId.bind(this),
      'after:aws:deploy:finalize:cleanup': this.updateApiStage.bind(this),
    };
  }

  createSettings() {
    this.apiStageSettings = new ApiStageSettings(this.serverless, this.options);
  }

  interceptRestApiId() {
    outputRestApiIdTo(this.serverless);
  }

  updateApiStage() {
    if (!this.cloudFormationContainsARestApi) {
      this.serverless.cli.log(`[${pluginName}] Not performing an update because no REST API was found.`);
      return;
    }
    return callAws.toUpdateApiStage(this.serverless, this.apiStageSettings);
  }

  cloudFormationContainsARestApi() {
    const restApi = this.serverless.service.provider.compiledCloudFormationTemplate.Resources['ApiGatewayRestApi'];
    return !empty(restApi);
  }
}

module.exports = Plugin;
