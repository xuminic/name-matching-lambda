import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NameMatchingLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Define the Lambda function
    //const myLambda = new lambda.Function(this, 'NameMatchingLambdaFunction', {
    //    runtime: lambda.Runtime.NODEJS_20_X, // or any other supported runtime
    //    handler: 'index.handler', // Adjust based on your handler
    //    code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')), // Path to your lambda.zip
    //});
    const myLambda = new lambda.Function(this, 'NameMatchingLambdaFunction', {
        runtime: lambda.Runtime.NODEJS_20_X, // or any other supported runtime
        handler: 'namematching.handler', // Adjust based on your handler
        code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')), // Path to your lambda.zip
	environment: {
	    //OPENAI_API_KEY: openAiApiKeySecret.secretValue.toString(),
	    OPENAI_API_KEY: 'your-actual-API-key',
        },
    });

    // Define the API Gateway
    const api = new apigateway.LambdaRestApi(this, 'NameMatchingGateway', {
        handler: myLambda,
        proxy: false,
    });

    // Define an API resource and method
    const items = api.root.addResource('items');
    items.addMethod('GET');  // GET /items
  }
}


