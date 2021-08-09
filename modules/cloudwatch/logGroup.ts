import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { resourcesNamePrefix } from "../constants/constants"
import { Output } from "@pulumi/pulumi";

/**
 * CloudwatchEvent
 */
export class LogGroup {
    
    logGroupName: pulumi.Input<string>;
    retentionInDays?: pulumi.Input<number>;
    tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>;
    
    logGroupARN: pulumi.Output<string>;


    /**
     * CloudwatchEvent constructor
     * @param lambdaArn lambda function arn
     */
    constructor(logGroupName: pulumi.Input<string>, retentionInDays: pulumi.Input<number> ,tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>) {
        this.logGroupName = logGroupName;
        this.retentionInDays = retentionInDays
        this.tags = tags
    }

    /**
     * createEvent
     */
    createLogGroup() {
        const logGroup = new aws.cloudwatch.LogGroup(resourcesNamePrefix+"log-group", {
            name: this.logGroupName,
            retentionInDays: this.retentionInDays,
            tags: this.tags
            
        });

        this.logGroupARN = logGroup.arn;

        return this
    }

    getLogGroupARN() {
        return this.logGroupARN
    }
}