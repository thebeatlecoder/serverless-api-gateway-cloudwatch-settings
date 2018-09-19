'use strict';

const ApiStageSettings = require('../src/ApiStageSettings');
const { expect } = require('chai');

describe('Creating the settings for the API Gateway stage', () => {
  let serverless, options, settings;

  describe('when nothing has been configured in serverless.yml', () => {

    before(() => {
      serverless = given_a_serverless_yml_file();

      settings = new ApiStageSettings(serverless);
    });

    it('creates empty settings', () => {
      expect(settings).to.be.empty;
    });
  });

  describe('enablling detailed CloudWatch metrics in serverless.yml', () => {

    before(() => {
      serverless = given_a_serverless_yml_file();
      serverless.service.custom.apiGatewayCloudWatchSettings = { metricsEnabled: true };

      settings = new ApiStageSettings(serverless);
    });

    it('enables them in the settings', () => {
      expect(settings.metricsEnabled).to.be.true;
    });
  });

  describe('disabling detailed CloudWatch metrics in serverless.yml', () => {

    before(() => {
      serverless = given_a_serverless_yml_file();
      serverless.service.custom.apiGatewayCloudWatchSettings = { metricsEnabled: false };

      settings = new ApiStageSettings(serverless);
    });

    it('disables them in the settings', () => {
      expect(settings.metricsEnabled).to.be.false;
    });
  });

  describe('when stage and region options are provided during an sls deploy', () => {

    before(() => {

      serverless = given_a_serverless_yml_file();
      serverless.service.custom.apiGatewayCloudWatchSettings = { metricsEnabled: true };
      options = { stage: 'test', region: 'us-east-1' };

      settings = new ApiStageSettings(serverless, options);
    });

    it('uses the stage option', () => {
      expect(settings.stage).to.equal(options.stage);
    });

    it('not use the provider stage', () => {
      expect(settings.stage).to.not.equal(serverless.service.provider.stage);
    });

    it('uses the region option', () => {
      expect(settings.region).to.equal(options.region);
    });

    it('not use the provider region', () => {
      expect(settings.region).to.not.equal(serverless.service.provider.region);
    });
  });
});

const given_a_serverless_yml_file = () => ({
  service: {
    provider: {
      stage: 'dev',
      region: 'eu-west-2'
    },
    custom: {}
  }
});
