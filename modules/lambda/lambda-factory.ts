import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Output } from "@pulumi/pulumi";
import * as Constant from "../constants/constants";
import { Runtime } from "@pulumi/aws/lambda";

export class LambdaFactory {
    
    /**
     * class properties
     */
    private lambdaCodePath: string
    private lambdaHandler: string
    private subnetIds: string[] = []
    private securityGroupIds: string[] = []
    private runtimeEngine: Runtime
    private roleArn: Output<string>
    private environmentVariables: pulumi.Input<{[key: string]: pulumi.Input<string>;}>
    private tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>;
    /**
     * Updatable Constants
     */
    private timeout: number = Constant.defaultLambdaTimeout
    private resourceName: string = Constant.lambdaFunctionName
    private lambdaArn: pulumi.Output<string>= null as any;

    /**
     * Output details
     */
    private lambdaName: pulumi.Output<string> = null as any;
    private lambdaLayers: Output<string>[] = [];

    /**
     * 
     * @param lambdaCodePath 
     * @param lambdaHandler 
     * @param runtimeEngine 
     * @param roleArn 
     * @param environmentVariables 
     */
    constructor(lambdaCodePath: string, lambdaHandler: string, runtimeEngine: Runtime, roleArn: Output<string>, environmentVariables: pulumi.Input<{[key: string]: pulumi.Input<string>;}>,tags?: pulumi.Input<{[key: string]: pulumi.Input<string>;}>) {
        this.lambdaCodePath = lambdaCodePath
        this.lambdaHandler = lambdaHandler
        this.roleArn = roleArn;
        this.runtimeEngine = runtimeEngine
        this.environmentVariables = environmentVariables
        this.tags = tags
    }

    updateResourceName(resourcesNamePrefix: string) {
        this.resourceName = resourcesNamePrefix.concat("-function");
        return this;
    }

    updateVpcConfig(subnetIds: string[], securityGroupIds: string[]) {
        this.subnetIds = subnetIds;
        this.securityGroupIds = securityGroupIds;
        return this;
    }

    updateTimeout(timeout:number) {
        this.timeout = timeout
        return this
    }

    attachLambdaLayers(layers: Output<string>[]) {
        this.lambdaLayers = layers
        return this
    }

    getLambdaArn() { return this.lambdaArn;}

    getLambdaName() { return this.lambdaName; }

    build() {

        const functionArgs:aws.lambda.FunctionArgs = FunctionFactory.init()
            .addMandateArgs(this.resourceName, this.lambdaHandler, this.roleArn, this.runtimeEngine)
            .addEnvironmentVariable(this.environmentVariables)
            .addCode(this.lambdaCodePath)
            .addTimeOut(this.timeout)
            .attachLayers(this.lambdaLayers)
            .addVpcConfig(this.subnetIds, this.securityGroupIds)
            .getFunctionArgs()

        const funtion = new aws.lambda.Function(this.resourceName, functionArgs)

        this.lambdaArn = funtion.arn
        this.lambdaName = funtion.name
        return this;
    }

}

export class FunctionFactory {

    private functionArgs:aws.lambda.FunctionArgs = null as any;

    static init() {
        return new FunctionFactory();
    }
    
    addMandateArgs(name: string, lambdaHandler: string, roleArn: Output<string>, engine: Runtime ) {
        this.functionArgs = {
            name: name,
            handler: lambdaHandler,
            role: roleArn,
            runtime: engine
        };
        return this;
    }

    attachLayers(layers_list: Output<string>[]){
        this.functionArgs = {
            ...this.functionArgs,
            layers: layers_list
        };
        return this;
    }


    addEnvironmentVariable(environmentVariables: pulumi.Input<{[key: string]: pulumi.Input<string>;}>) {
        if(environmentVariables) {
            this.functionArgs = {
                ...this.functionArgs,
                environment: {
                    variables: environmentVariables
                }
            }
        }
        return this;
    }


    addCode(lambdaCodePath: string) {
        if(lambdaCodePath) {
            this.functionArgs = {
                ...this.functionArgs,
                code: new pulumi.asset.AssetArchive({
                    ".": new pulumi.asset.FileArchive(lambdaCodePath)
                })
            }
        }
        return this;
    }

    addTimeOut(timeout: number) {
        this.functionArgs = {
            ...this.functionArgs,
            timeout: timeout
        }
        return this;
    }

    addVpcConfig(subnetIds: string[], securityGroupIds: string[]) {
        if(subnetIds.length > 0 && securityGroupIds.length > 0){
            this.functionArgs = {
                ...this.functionArgs,
                vpcConfig: {
                    subnetIds: subnetIds,
                    securityGroupIds: securityGroupIds
                }
            }
        }

        return this
    }

    addTags(tags: pulumi.Input<{[key: string]: pulumi.Input<string>;}> | null){
        if(tags){
            this.functionArgs = {
                ...this.functionArgs,
                tags: tags
            }
        }
        return this;
    }

    getFunctionArgs(): aws.lambda.FunctionArgs {
        return this.functionArgs;
    }
}