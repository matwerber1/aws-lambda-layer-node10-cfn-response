# aws-lambda-layer-node-10-cfn-response

This project deploys a CloudFormation template that creates an AWS [Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) that contains a synchronous and asynchronous version of the [cfn-response](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudformation.html) helper function that is used by custom CloudFormation resources (i.e. Lambda functions) to send CREATE, UPDATE, and DELETE notifications to CloudFormation by posting the responses to signed S3 URLs. 

The CloudFormation template also includes a demo CloudFormation custom resource that creates an S3 bucket. The demo resource uses the helper function from the Lambda Layer to send updates to CloudFormation. The project contains both a synchronous and asynchronous custom resource do demo both strategies and also show how a single Lambda layer may be used in multiple Lambdas. 

## Prerequisites

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed and configured
2. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed and configured
3. Pre-existing S3 bucket to which CloudFormation assets (templates) will be uploaded.

## Deployment

1. Open **deploy.sh** and specify the bucket to which the SAM CLI will upload your CloudFormation templates for processing:

```sh
# deploy.sh
BUCKET=your_s3_bucket_name
```

2. Run the deployment script: 

```sh
$ ./deploy.sh
```

3. Navigate to the [CloudFormation console](https://console.aws.amazon.com/cloudformation/home) and verify that the stack created and that the custom resources created two S3 buckets.