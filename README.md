# Serverless API Gateway Cloudwatch Settings

A Serverless v1.x plugin that enables you to easily configure the CloudWatch settings for an API Gateway.

So far I have only added support for enabling detailed CloudWatch metrics for an entire API Gateway stage.

## Install

```sh
$ npm install serverless-api-gateway-cloudwatch-settings --save-dev
```

Add the plugin to your `serverless.yml` file:

```yml
plugins:
  - serverless-api-gateway-cloudwatch-settings
```
 
## Configure

```yml
custom:
  apiGatewayCloudWatchSettings:
    metricsEnabled: true
```
