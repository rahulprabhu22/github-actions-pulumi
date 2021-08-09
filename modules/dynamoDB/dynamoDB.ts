import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { resourcesNamePrefix } from "../constants/constants"
import { Output } from "@pulumi/pulumi";
import { input } from "@pulumi/aws/types";


/**
 * CloudwatchEvent
 */
export class DynamoDB {
    
    dynamoDBTableName: pulumi.Input<string>;
    attributes: pulumi.Input<pulumi.Input<input.dynamodb.TableAttribute>[]>;
    hashKey: pulumi.Input<string>
    readCapacity?: pulumi.Input<number>;
    writeCapacity?: pulumi.Input<number>;
    
    tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>;

    dynamoDBTableARN: Output<string>


    /**
     * CloudwatchEvent constructor
     * @param lambdaArn lambda function arn
     */
    constructor(dynamoDBTableName: pulumi.Input<string>, attributes: pulumi.Input<pulumi.Input<input.dynamodb.TableAttribute>[]>, hashKey: pulumi.Input<string>, readCapacity: pulumi.Input<number>,writeCapacity: pulumi.Input<number>,tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>) {
        this.dynamoDBTableName = dynamoDBTableName
        this.attributes = attributes
        this.hashKey = hashKey
        this.readCapacity = readCapacity
        this.writeCapacity = writeCapacity
        this.tags = tags
    }

    /**
     * createEvent
     */
    createTable() {
        const dynamodbTable = new aws.dynamodb.Table(resourcesNamePrefix+"Table", {
            name: this.dynamoDBTableName,
            attributes: this.attributes,
            hashKey: this.hashKey,
            readCapacity: this.readCapacity,
            writeCapacity: this.writeCapacity,
            tags: this.tags
        });

        this.dynamoDBTableARN = dynamodbTable.arn;

        return this
    }

    getDynamoDBTableARN() {
        return this.dynamoDBTableARN
    }
}