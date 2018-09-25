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
    if (this.cloudFormationContainsARestApi()) {
      outputRestApiIdTo(this.serverless);
    }
  }

  updateApiStage() {
    if (this.cloudFormationContainsARestApi()) {
      return callAws.toUpdateApiStage(this.serverless, this.apiStageSettings);
    } else {
      this.serverless.cli.log(`[${pluginName}] Not performing an update because no REST API was found.`); 
    }    
  }

  cloudFormationContainsARestApi() {
    const restApi = this.serverless.service.provider.compiledCloudFormationTemplate.Resources['ApiGatewayRestApi'];
    return !empty(restApi);
  }
}

module.exports = Plugin;
