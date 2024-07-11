import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class BCIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket
    const bucket = new s3.Bucket(this, 'BankBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // DynamoDB table for customer data
    const customerTable = new dynamodb.Table(this, 'CustomerTable', {
      tableName: 'CustomerTable', 
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Export the table name for use in the API stack
    new cdk.CfnOutput(this, 'CustomerTableName', {
      value: customerTable.tableName,
      exportName: 'CustomerTableName', // Export this value under the name 'CustomerTableName'
    });
  }
}
