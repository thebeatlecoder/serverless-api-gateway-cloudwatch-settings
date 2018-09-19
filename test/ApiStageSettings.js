'use strict';

const ApiStageSettings = require('../src/ApiStageSettings');
const { expect } = require('chai');

describe('Creating the settings for the API Gateway stage', () => {
  let settings;

  describe('when nothing has been configured in the serverless.yml file', () => {

    before(() => {
      const serverless = {
        service: {
          provider: {
            stage: 'dev',
            region: 'eu-west-2'
          }
        },
      };
      settings = new ApiStageSettings(serverless);
    });

    it('creates empty settings', () => {
      expect(settings).to.be.empty;
    });
  });

  describe('enablling detailing CloudWatch metrics in the serverless.yml file', () => {

    before(() => {
      const serverless = {
        service: {
          provider: {
            stage: 'dev',
            region: 'eu-west-2'
          },
          custom: {
            apiGatewayCloudWatchSettings: {
              metricsEnabled: true
            }
          }
        }
      };
      settings = new ApiStageSettings(serverless);
    });

    it('enables them in the settings', () => {
      expect(settings.metricsEnabled).to.be.true;
    });
  });

  describe('disabling detailing CloudWatch metrics in the serverless.yml file', () => {

    before(() => {
      const serverless = {
        service: {
          provider: {
            stage: 'dev',
            region: 'eu-west-2'
          },
          custom: {
            apiGatewayCloudWatchSettings: {
              metricsEnabled: false
            }
          }
        }
      };

      settings = new ApiStageSettings(serverless);
    });

    it('disables them in the settings', () => {
      expect(settings.metricsEnabled).to.be.false;
    });
  });
});
