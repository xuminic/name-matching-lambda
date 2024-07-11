
# Welcome to the OpenAI API Testing project

This is a demostration project for implementing the OpenAI API in AWS lambda.
The lambda function and other assets would be deploied with AWS CDK.

## Build and test the program locally

Using the following command to install the required Node packages, build and test the program in local environment.

* make
* export OPENAI_API_KEY=your-openai-api-key
* node dist/handler.js "吴华文"

## Clean up the the program locally

You may using
'''
make clean
'''
to delete the compiled javascript files, or using
'''
make dist-clean
'''
to delete every generated files and Node pacakges. 

## Deploy the lambda function to AWS

Using the following command to install the required Node packages, build and test the program in local environment.

Edit the lib/name-matching-lambda-stack.ts file. Replace the 'your-actual-API-key' in this line
'''
OPENAI_API_KEY: 'your-actual-API-key',
'''
with the actual API key or with the Secrets Manager for Secure Storage. Then

* make
* make deploy

## Test the lambda function in AWS

After the successful deploy, there should be an URL to access API Gateway like this
'''
https://utx9mua4y5.execute-api.ap-southeast-2.amazonaws.com/prod/
'''

You may using curl to do the test:
'''
curl -X GET "https://utx9mua4y5.execute-api.ap-southeast-2.amazonaws.com/prod/items?name=huawen"
'''

## Destroy and clean up the deploied resources in AWS

The lambda function and other resources can be easily deleted and cleaned with

* make destroy


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


