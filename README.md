
# Welcome to the OpenAI API Demostration Project

This is a demostration project for implementing the OpenAI API with TypeScript in AWS lambda function.
The lambda function and other assets would be deployed with AWS CDK.

## Build and test the program locally

This project requires Node v16 and higher.
Using the following command to install the required Node packages, build and test the program in local environment.
```
make
export OPENAI_API_KEY=your-openai-api-key
node lambda/namematching.js wenhua
```
## Clean up the the program locally

You may delete the compiled files and clean up the target directory by 
```
make clean
```
or delete every generated files and the Node pacakges by
```
make dist-clean
```
The Node packages would be regenerated automatically when building the program.

## Deploy the lambda function to AWS

Using the following command to deploy the lambda function and the API Gateway to AWS cloud.

Edit the lib/name-matching-lambda-stack.ts file. Replace the `your-actual-API-key` in this line
```
OPENAI_API_KEY: 'your-actual-API-key',
```
with the actual API key or with the Secrets Manager for Secure Storage. Then
```
make
make deploy
```

After a successful deploy, there should be an URL to access, like this
```
https://z2uhy4dpy6.execute-api.ap-southeast-2.amazonaws.com/prod/
```

You may using curl to do the test:
```
curl -X GET "https://z2uhy4dpy6.execute-api.ap-southeast-2.amazonaws.com/prod/items?name=huawen"
```

## Destroy and clean up the deployed resources in AWS

The lambda function and other resources can be easily deleted and cleaned by
```
make destroy
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


