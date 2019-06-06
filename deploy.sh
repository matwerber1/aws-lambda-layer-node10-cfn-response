BUCKET=your_s3_bucket_name

STACK_NAME=lambda-layer-cfn-response-demo3

sam package \
    --s3-bucket $BUCKET \
    --template-file template.yaml \
    --output-template-file packaged.yaml

sam deploy \
    --template-file packaged.yaml \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_IAM
