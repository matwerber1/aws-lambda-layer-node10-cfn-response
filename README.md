# aws-lambda-layer-node-10-cfn-response

This project deploys a CloudFormation template that creates an AWS [Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) that contains a synchronous and asynchronous version of the [cfn-response](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudformation.html) helper function that is used by custom CloudFormation resources (i.e. Lambda functions) to send CREATE, UPDATE, and DELETE notifications to CloudFormation by posting the responses to signed S3 URLs. 

The CloudFormation template also includes a demo CloudFormation custom resource that creates an S3 bucket. The demo resource uses the helper function from the Lambda Layer to send updates to CloudFormation. The project contains both a synchronous and asynchronous custom resource do demo both strategies and also show how a single Lambda layer may be used in multiple Lambdas. 

## Prerequisites

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed and configured
2. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed and configured
3. Pre-existing S3 bucket to which CloudFormation assets (templates) will be uploaded.

## Demo Deployment

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

# Production Usage

1. Create a Lambda Layer
2. Associate the Lambda Layer to your Lambda function(s) that act as custom CloudFormation resources
3. From within the Lambda(s), import the sync or async version from the layer:
    ```
    # async version
    const cfnResponse = require('cfn-response-async');

    # sync version
    const cfnResponse = require('cfn-response-sync');
    ```

4. When you are ready to send a SUCCESS or FAILED response to CloudFormation from your custom Lambda, invoke the send() method:

    ```
    # async verison
    return await cfnResponse.send(event, context, responseStatus, responseData, physicalResourceId, noEcho);

    # sync version
    cfnResponse.send(event, context, responseStatus, responseData, physicalResourceId, noEcho);
    callback(null);
    ```

    Apart from the fact that the async version of send() returns a promise, the two functions above are identical. The other two
    differences to remember is that with an async version of Lambda, you end the function by calling ```return;``` or by ```throw(err)```,
    and with the sync version, the function continues until the event loop is empty (callback is used, too). 
    Read [AWS Lambda Function Handler in Node.js](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html) for more info. 

6. event, context, responseStatus are required for all events. 
7. physicalResourceId is required for successful CREATE and UPDATE events.
7. responseData and noEcho are optional parameters.

## License

[MIT License](https://opensource.org/licenses/MIT)