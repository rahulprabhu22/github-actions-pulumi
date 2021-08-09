import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export const resourcesNamePrefix = `${pulumi.getStack()}-`;
// export const runtime = aws.lambda.Python3d8Runtime;
export const projectName = "rahul-pulumi-api-logging";


export const lambdaFunctionName = "rahul-github-actions-function";
export const logGroupForLambda = `/aws/lambda/${lambdaFunctionName}`;

export const lambdaHandler = "lambda.lambda_handler";
export const lambdaCodePath = "./serverless/github-actions";
export const defaultLambdaTimeout = 60;
export const pythonRuntime = aws.lambda.Python3d8Runtime;
export const nodeRuntime = aws.lambda.NodeJS12dXRuntime;

export const eventPattern = `{
    "source": [
        "aws.ec2",
        "aws.s3"
    ],
    "detail-type": [
        "AWS API Call via CloudTrail"
    ],
    "detail": {
        "eventSource": [
            "ec2.amazonaws.com",
            "s3.amazonaws.com"
        ],
        "eventName": [
            "StartInstances",
            "StopInstances",
            "RunInstances",
            "TerminateInstances",
            "CreateBucket",
            "DeleteBucket",
            "PutObject"
        ]
    }
}`;