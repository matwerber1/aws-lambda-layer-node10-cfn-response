const aws = require('aws-sdk');
const s3 = new aws.S3();
const cfnResponse = require('cfn-response-async');

exports.handler = async (event, context) => {
    
    console.log('Received event:\n' + JSON.stringify(event, null, 2));
    console.log('Received context:\n' + JSON.stringify(context, null, 2));

    try {
        var bucketName; 
        var responseData;
        var physicalResourceId; 

        if ((event.ResourceProperties).hasOwnProperty('BucketName')) {
            bucketName = event.ResourceProperties.BucketName;
        }

        if (event.RequestType === 'Create' || event.RequestType === 'Update') {
            createResponse = await s3.createBucket({ Bucket: bucketName }).promise(); 
            physicalResourceId = bucketName; 
            responseData = {
                url: `http://${bucketName}.s3.amazonaws.com`
            };
        }
        else if (event.RequestType === 'Delete') {
            deleteResponse = await s3.deleteBucket({ Bucket: bucketName }).promise(); 
        }
        return await cfnResponse.send(event, context, "SUCCESS", responseData, physicalResourceId); 
    }
    catch (err) {
        let errMsg = `${err.name}:\n${err.message}`;
        let responseData = { Error: errMsg };
        console.log(errMsg);

        return await cfnResponse.send(event, context, "FAILED", responseData); 
    }
};