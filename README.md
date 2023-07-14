## Exercise descripton

The assignment is to create a serverless REST API that fetches a route plan based on coordinates from the OpenTripPlanner2 server and amends calculated CO2 emissions to the response.

## Assumptions
- The API should have an endpoint that must return a response defined in the schema in the excercise pdf.
- The endpoint should fetche a route plan based on coordinates from the OpenTripPlanner2 server and amends calculated CO2 emissions to the response, the user should provide [**fromPlace** - **toPlace** - **time** - **date** - **mode**] in query params. if theyre not provided it should return an error.

## Solution formulation
- I immediatly started by testing the **curl** command provided in the PDF, it gave me the necessary data that i should work with, it shows an itinerary that consists of multiple legs and it represents the complete travel plan from the starting point to the destination, It encompasses all the legs involved in the journey, in the response i got from the api each leg has a distance, so i have to convert that distance to KM then multiply that distance by the CO2 emissions multiplier to the corresponding mode of transport. after that i can simply add the calculated result to the itinerary object as the property **co2**, also adding and removing necessary properties specified in the reponse schema.

## Libraries/Tools used
- Node v16.9.1
- Serverless Framework
- aws-cli
- postman
- axios
- dotenv
- express
- jest
- jest-json-schema
- serverless-http

## How to setup
- Install Nodejs: Download and install Node.js from the official website (https://nodejs.org). Follow the installation instructions for your operating system.

- Install Serverless: `npm install -g serverless`

- Configure serverless with aws credentials <br>
    - using serverless cli:<br>
    `serverless config credentials --provider aws --key YOUR_AWS_ACCESS_KEY --secret YOUR_AWS_SECRET_KEY`
    - or using AWS CLI after installing it by following the instructions in the AWS CLI documentation 
    (https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
    <br>
    `aws configure`<br>
    `AWS Access Key ID [None]:  <YOUR_AWS_ACCESS_KEY>`<br>
    `AWS Secret Access Key [None]: <YOUR_AWS_SECRET_KEY>`<br>
    `Default region name [None]: <REGION>`<br>
    `Default output format [None]: ENTER`<br>
    - run `cat ~/.aws/credentials` to make sure credentials are good.

- run:
    - `npm install`
    - `npm run deploy`

## Running tests
* To run the tests run `npm run test` or `jest` on the project root.
    - ✓ GET [/route-plan] should return the expected response
    - ✓ GET [/route-plan] the response should match json schema 
    - ✓ GET [/route-plan] should return the expected response 400 
    - ✓ GET [/route-plan] should return the expected response 404

## To Test Result: 
- The Api is Deployed and can be accessed here __https://lydwa6jmn8.execute-api.us-east-1.amazonaws.com/dev/route-plan__
- **Demo Request** 
__https://lydwa6jmn8.execute-api.us-east-1.amazonaws.com/dev/route-plan?fromPlace=60.148156622692035,24.987887975719225&toPlace=60.19461994799159,24.870836734771732&time=8:40am&date=07-13-2023&mode=TRANSIT__
 