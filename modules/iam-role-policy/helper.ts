import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Output } from "@pulumi/pulumi";
import { resourcesNamePrefix, projectName } from "../constants/constants"


/**
 * IAMHelper
 */
export class IAMHelper {

    static createBasicLambdaFunctionRole(resourcesNamePref: string) {
        const lambdaRole = new aws.iam.Role(resourcesNamePref+ "lambda-iam-role",{
            name: resourcesNamePref+ "lambda-iam-role",
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "lambda.amazonaws.com"
            })
        });

        new aws.iam.RolePolicyAttachment(resourcesNamePref + "lambdaAccess-policy-attachment", {
            role: lambdaRole.name,
            policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
        });

        new aws.iam.RolePolicyAttachment(resourcesNamePref + "vpclambda-policy-attachment", {
            role: lambdaRole.name,
            policyArn: aws.iam.ManagedPolicies.AWSLambdaVPCAccessExecutionRole,
        });

        return lambdaRole;
    }

    static createBasicLambdaFunctionRoleWithCustomPrefix(resourcesNamePref: string) {
        const lambdaRole = new aws.iam.Role(resourcesNamePref+ "-lambda-iam-role",{
            name: resourcesNamePref+ "lambda-iam-role",
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "lambda.amazonaws.com"
            })
        });

        new aws.iam.RolePolicyAttachment(resourcesNamePref + "-lambdaAccess-policy-attachment", {
            role: lambdaRole.name,
            policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
        });

        new aws.iam.RolePolicyAttachment(resourcesNamePref + "-vpclambda-policy-attachment", {
            role: lambdaRole.name,
            policyArn: aws.iam.ManagedPolicies.AWSLambdaVPCAccessExecutionRole,
        });

        return lambdaRole;
    }

    /**
     * 
     * @param crossAccountRoleArns 
     */
    static addRDSFullAccessRole(resourcesNamePref: string, lambdaRoleName: Output<string>) {
        const policyAttachment = new aws.iam.RolePolicyAttachment(resourcesNamePref + "rds_lambda-policy-attachment", {
            role: lambdaRoleName,
            policyArn: aws.iam.ManagedPolicies.AmazonRDSFullAccess,
        });
        return policyAttachment;
    }

    /**
     * 
     * @param crossAccountRoleArns 
     */
     static addSNSFullAccessRole(resourcesNamePref: string, lambdaRoleName: Output<string>) {
        const policyAttachment = new aws.iam.RolePolicyAttachment(resourcesNamePref + "-sns-topic-policy-attachment", {
            role: lambdaRoleName,
            policyArn: aws.iam.ManagedPolicies.AmazonSNSFullAccess,
        });
        return policyAttachment;
    }

    /**
     * 
     * @param crossAccountRoleArns 
     */
     static addDirectoryServiceFullAccessRole(resourcesNamePref: string, lambdaRoleName: Output<string>) {
        const policyAttachment = new aws.iam.RolePolicyAttachment(resourcesNamePref + "-directory-service-policy-attachment", {
            role: lambdaRoleName,
            policyArn: aws.iam.ManagedPolicies.AWSDirectoryServiceFullAccess,
        });
        return policyAttachment;
    }

    /**
     * 
     * @param crossAccountRoleArns 
     */
     static addSecretsManagerReadWriteRole(resourcesNamePref: string, lambdaRoleName: Output<string>) {
        const crossAccountPolicy = new aws.iam.Policy(resourcesNamePref+ "-secrets-manager-policy-attachment",{
            policy: `{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": [
                            "secretsmanager:*",
                            "cloudformation:CreateChangeSet",
                            "cloudformation:DescribeChangeSet",
                            "cloudformation:DescribeStackResource",
                            "cloudformation:DescribeStacks",
                            "cloudformation:ExecuteChangeSet",
                            "ec2:DescribeSecurityGroups",
                            "ec2:DescribeSubnets",
                            "ec2:DescribeVpcs",
                            "kms:DescribeKey",
                            "kms:ListAliases",
                            "kms:ListKeys",
                            "lambda:ListFunctions",
                            "rds:DescribeDBClusters",
                            "rds:DescribeDBInstances",
                            "redshift:DescribeClusters",
                            "tag:GetResources"
                        ],
                        "Effect": "Allow",
                        "Resource": "*"
                    },
                    {
                        "Action": [
                            "lambda:AddPermission",
                            "lambda:CreateFunction",
                            "lambda:GetFunction",
                            "lambda:InvokeFunction",
                            "lambda:UpdateFunctionConfiguration"
                        ],
                        "Effect": "Allow",
                        "Resource": "arn:aws:lambda:*:*:function:SecretsManager*"
                    },
                    {
                        "Action": [
                            "serverlessrepo:CreateCloudFormationChangeSet",
                            "serverlessrepo:GetApplication"
                        ],
                        "Effect": "Allow",
                        "Resource": "arn:aws:serverlessrepo:*:*:applications/SecretsManager*"
                    },
                    {
                        "Action": [
                            "s3:GetObject"
                        ],
                        "Effect": "Allow",
                        "Resource": [
                            "arn:aws:s3:::awsserverlessrepo-changesets*",
                            "arn:aws:s3:::secrets-manager-rotation-apps-*/*"
                        ]
                    }
                ]
            }`
        });

        const policyAttachment = new aws.iam.RolePolicyAttachment(resourcesNamePref+ "secrets-manager-policy-attachment", {
            role: lambdaRoleName,
            policyArn: crossAccountPolicy.arn
        });
        return policyAttachment;
    }

    /**
     * 
     * @param crossAccountRoleArns 
     */
    static addS3FullAccessRole(resourcesNamePref: string, lambdaRoleName: Output<string>) {
        const policyAttachment = new aws.iam.RolePolicyAttachment(resourcesNamePref + "s3lambda-policy-attachment", {
            role: lambdaRoleName,
            policyArn: aws.iam.ManagedPolicies.AmazonS3FullAccess,
        });
        return policyAttachment;
    }

    /**
     * 
     * @param crossAccountRoleArns 
     */
    static addCloudwatchLogFullAccessRole(resourcesNamePref: string, lambdaRoleName: Output<string>) {
        const policyAttachment = new aws.iam.RolePolicyAttachment(resourcesNamePref + "cloudwatchlog-lambda-policy-attachment", {
            role: lambdaRoleName,
            policyArn: aws.iam.ManagedPolicies.CloudWatchFullAccess,
        });
        return policyAttachment;
    }

    /**
     * createLambdaFunctionRole
     * @returns lambdaRole
     */
    static createLambdaFunctionRole(crossAccountRoleArns: string[]) {
    
        const lambdaRole = new aws.iam.Role(resourcesNamePrefix+ "lambda-iam-role",{
            name: resourcesNamePrefix+ "lambda-iam-role",
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "lambda.amazonaws.com"
            })
        });

        const crossAccountPolicy = new aws.iam.Policy(resourcesNamePrefix+ "cross-account-access",{
            policy: `{
                "Version":"2012-10-17",
                "Statement":[
                   {
                      "Effect":"Allow",
                      "Action":"sts:AssumeRole",
                      "Resource":[
                         "${crossAccountRoleArns[0]}",
                         "${crossAccountRoleArns[1]}",
                         "${crossAccountRoleArns[2]}"
                      ]
                   }
                ]
             }`
        });

        new aws.iam.RolePolicyAttachment(resourcesNamePrefix+ "cross-account-access", {
            role: lambdaRole,
            policyArn: crossAccountPolicy.arn
        });

        new aws.iam.RolePolicyAttachment(resourcesNamePrefix + "lambdaAccess-policy-attachment", {
            role: lambdaRole,
            policyArn: aws.iam.ManagedPolicies.AWSLambdaFullAccess,
        });

        new aws.iam.RolePolicyAttachment(resourcesNamePrefix+"send_ses_mail", {
            role: lambdaRole,
            policyArn: aws.iam.ManagedPolicies.AmazonSESFullAccess
        })

        return lambdaRole

    }

    /**
     * addLambdaEventPermission
     * @param lambdaFunctionName lambda function name
     * @returns eventlambda lambda permission
     */
    static addLambdaEventPermission(lambdaFunctionName: Output<string>) {
        const eventLambdaPermission = new aws.lambda.Permission(resourcesNamePrefix+ "event-lambda-permission", {
            action: "lambda:InvokeFunction",
            function: lambdaFunctionName,
            principal: "events.amazonaws.com"
            
        });
        return eventLambdaPermission
    }

    /**
     * addLambdaEventPermission
     * @param lambdaFunctionName lambda function name
     * @returns eventlambda lambda permission
     */
    static addLambdaEventPermissionWithSource(lambdaFunctionName: Output<string>, sourceArn: Output<string>) {
        const eventLambdaPermission = new aws.lambda.Permission(resourcesNamePrefix+ "event-lambda-permission", {
            action: "lambda:InvokeFunction",
            function: lambdaFunctionName,
            principal: "events.amazonaws.com",
            sourceArn: sourceArn
            
        });
        return eventLambdaPermission
    }

    /**
     * 
     * @param name CrossAccountRole
     * @param lambdaRoleArn lambda role arn
     * @returns crossAccountRoleforLambda 
     */
    static createCrossAccountRole(name: string, accountArn: string) {

        const crossAccountRoleforLambda = new aws.iam.Role(name, {
            name: name,
            assumeRolePolicy: `{
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Principal": {
                        "AWS": "${accountArn}"
                        
                    }
                }]
            }`
        });
        
        new aws.iam.RolePolicyAttachment("full-access",{
            role: crossAccountRoleforLambda,
            policyArn: aws.iam.ManagedPolicies.AdministratorAccess
        });

        return crossAccountRoleforLambda
    }

    /**
     * 
     * @param name CrossAccountRole
     * @param lambdaRoleArn lambda role arn
     * @param services list of services
     * @returns crossAccountRoleforLambda 
     */
    static createCrossAccountRoleWithService(name: string, accountArn: string, services: string[]) {

        const crossAccountRoleforLambda = new aws.iam.Role(name, {
            name: name,
            assumeRolePolicy: `{
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Principal": {
                        "AWS": "${accountArn}",
                        "Service": "${services}"
                    }
                }]
            }`
        });
        
        new aws.iam.RolePolicyAttachment("full-access",{
            role: crossAccountRoleforLambda,
            policyArn: aws.iam.ManagedPolicies.AdministratorAccess
        });

        return crossAccountRoleforLambda
    }

    static createLambdaRoleForAPILogging(bucketARN: Output<string>, dynamodbTableARN: Output<string>, logGroupARN: Output<string>,tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>){
        const lambdaRole = new aws.iam.Role(resourcesNamePrefix+ "lambda-iam-role",{
            name: projectName+ "lambda-iam-role",
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "lambda.amazonaws.com"
            }),
            tags: tags
        });


        const apiLoggingPolicy = new aws.iam.Policy(resourcesNamePrefix+ "managed-policy",{
            name: projectName + "-policy",
            policy: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Action: ["s3:*"],
                    Effect: "Allow",
                    Resource: bucketARN.apply(arn => `${arn}/*`)
                  },     {
                    Action: ["dynamodb:*"],
                    Effect: "Allow",
                    Resource: dynamodbTableARN.apply(arn => `${arn}`)
                  },
                  {
                    Action: [
                      "logs:CreateLogGroup",
                      "logs:CreateLogStream",
                      "logs:PutLogEvents"
                    ],
                    Resource: logGroupARN.apply(arn => `${arn}:*`),
                    Effect: "Allow"
                  }   
                ]
              },
            tags: tags
        });

        const policyAttachment = new aws.iam.RolePolicyAttachment(resourcesNamePrefix+ "policy-attachment", {
            role: lambdaRole,
            policyArn: apiLoggingPolicy.arn
        });

        return lambdaRole;
    }


}


