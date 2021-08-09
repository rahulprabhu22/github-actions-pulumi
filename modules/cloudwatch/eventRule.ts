import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { resourcesNamePrefix , projectName} from "../constants/constants"
import { Output } from "@pulumi/pulumi";

/**
 * CloudwatchEvent
 */
export class CloudwatchEventRule {
    
    lambdaArn: Output<string>
    cloudwatchDescription: string
    eventPattern: pulumi.Input<string>
    tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>;

    eventRuleId: Output<string>
    eventRuleName: Output<string>
    eventRuleArn: Output<string>
    eventTargetId: Output<string>


    /**
     * CloudwatchEvent constructor
     * @param lambdaArn lambda function arn
     */
    constructor(lambdaArn: Output<string>, cloudwatchDescription: string, eventPattern: pulumi.Input<string>,tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>) {
        this.lambdaArn = lambdaArn;
        this.cloudwatchDescription = cloudwatchDescription
        this.eventPattern = eventPattern
        this.tags = tags
    }

    /**
     * createEvent
     */
    createEvent() {
        const eventRule = new aws.cloudwatch.EventRule(resourcesNamePrefix+"event-rule", {
            name: projectName + "-event-rule",
            description: this.cloudwatchDescription,
            eventPattern: this.eventPattern,
            isEnabled: true,
            tags: this.tags
            
        });

        const eventTarget = new aws.cloudwatch.EventTarget(resourcesNamePrefix+"event-target",{
            arn: this.lambdaArn,
            rule: eventRule.name
        });

        this.eventRuleId = eventRule.id;
        this.eventRuleArn = eventRule.arn;
        this.eventRuleName = eventRule.name;
        this.eventTargetId = eventTarget.id;

        return this
    }

    getEventRuleId() {
        return this.eventRuleId
    }

    getEventRuleArn() {
        return this.eventRuleArn
    }
}