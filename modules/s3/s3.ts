
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { resourcesNamePrefix } from "../constants/constants";
import { Output,Input} from "@pulumi/pulumi";


export class S3 {

  private bucketName: Input<string>
  private tags?: Input<{[key: string]: pulumi.Input<string>;}>;

  private bucketARN: Output<string>;
  private websiteEndpoint: Output<string>

  constructor(bucketName: Input<string>, tags?: Input<{[key: string]: pulumi.Input<string>;}>) {
    this.bucketName = bucketName
    this.tags = tags
    }

  /** CodeDeploy Ec2 Policy creation
   * @param name resource name
   */
   createBucket() {
    const s3Bucket = new aws.s3.Bucket(resourcesNamePrefix + "bucket", {
      acl: "private",
      bucket: this.bucketName,
      forceDestroy: true,
      tags: this.tags
    });

    this.bucketARN = s3Bucket.arn
    this.websiteEndpoint = s3Bucket.websiteEndpoint

    return this
  }

  getBucketARN(){
    return this.bucketARN;
  }

}