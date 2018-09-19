'use strict';

const ApiStageSettings = require('./ApiStageSettings');
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
    return callAws.toUpdateApiStage(this.serverless, this.apiStageSettings);
  }
}

module.exports = Plugin;
