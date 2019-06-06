const aws = require('aws-sdk');
const s3 = new aws.S3();
const cfnResponse = require('cfn-response-sync');

exports.handler = function (event, context, callback) {

    console.log('Received event:\n' + JSON.stringify(event, null, 2));
    console.log('Received context:\n' + JSON.stringify(context, null, 2));

    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    
        let bucketName = event.ResourceProperties.BucketName
        

        let params = {
            Bucket: bucketName
        };
        
        s3.createBucket(params, function (err, data) {
            if (err) {
                let responseData = { Error: "Create bucket failed" };
                console.log(responseData.Error + ":\n", err);
                cfnResponse.send(event, context, "FAILED", responseData);
                callback(null);
            }
            else {
                let physicalResourceId = bucketName;
                let responseData = {
                    url: `http://${bucketName}.s3.amazonaws.com`
                };
                cfnResponse.send(event, context, "SUCCESS", responseData, physicalResourceId);
                callback(null);
            }

        });
    }
    else if (event.RequestType === 'Delete') {
        
        let params = {
            Bucket: event.ResourceProperties.BucketName 
        };

        s3.deleteBucket(params, function (err, data) {
            if (err) {
                let responseData = { Error: "Delete bucket failed" };
                console.log(responseData.Error + ":\n", err);
                cfnResponse.send(event, context, "FAILED", responseData); 
                callback(null);
            }
            else {
                cfnResponse.send(event, context, "SUCCESS");
                callback(null);
            }
        });
    }
    else {
        let err = `Unsupported RequestType ${event.RequestType}`;
        console.log(err);
        callback(err);
    }
};