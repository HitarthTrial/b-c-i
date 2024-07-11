import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class BAStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import the DynamoDB table from the infrastructure stack
    const customerTable = dynamodb.Table.fromTableName(this, 'ImportedCustomerTable', cdk.Fn.importValue('CustomerTableName'));

    // Lambda function for querying customer data
    const queryLambda = new lambda.Function(this, 'QueryLambdaHandler', {
      runtime: lambda.Runtime.PYTHON_3_10,
      code: lambda.Code.fromAsset('lambda/bank-poc'),
      handler: 'query.handler',
      environment: {
        TABLE_NAME: customerTable.tableName,
      },
    });

    // Grant the Lambda function read access to the DynamoDB table
    customerTable.grantReadData(queryLambda);
  }
}
