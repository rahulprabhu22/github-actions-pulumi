import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { LogGroup } from "./modules/cloudwatch/logGroup";
import { LambdaFactory } from "./modules/lambda/lambda-factory";
import { IAMHelper } from "./modules/iam-role-policy/helper";
import { logGroupForLambda, lambdaCodePath ,lambdaHandler, pythonRuntime} from "./modules/constants/constants"

const createResource = async () => {

    const commonTags = {
        "createdBy" : "rahul",
        "purpose": "training"
    }

    const envVars = {
        "BUCKET" : "DemoENV"
    }

    const logGroup = new LogGroup(logGroupForLambda,0,commonTags).createLogGroup();

    const lambdaRole = IAMHelper.createBasicLambdaFunctionRole("rahul-github-actions-");

    const lambdaFunction = new LambdaFactory(lambdaCodePath, lambdaHandler, pythonRuntime,lambdaRole.arn ,envVars).build();
}

createResource()
