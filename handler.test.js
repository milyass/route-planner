const { getRoutePlan } = require('./handler');
const { matchers } = require('jest-json-schema');
const { responseSchema } = require('./constants'); 
expect.extend(matchers);

describe('Serverless Handler', () => {
  
  it('GET [/route-plan] should return the expected response', async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1 // we add one because its zero based
    const year = currentDate.getFullYear()
    const day = currentDate.getDate()
    const event = {
      httpMethod: 'GET',
      path: '/route-plan',
      queryStringParameters: {
        fromPlace: '60.148156622692035,24.987887975719225',
        toPlace: '60.19461994799159,24.870836734771732',
        time: '8:40am',
        date: `${month}-${day}-${year}`,
        mode: 'TRANSIT',
      },
    };

    const context = {};
    const response = await getRoutePlan(event, context);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty('plan');
  });

  it('GET [/route-plan] the response should match json schema', async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1 
    const year = currentDate.getFullYear();
    const day = currentDate.getDate();
    const event = {
      httpMethod: 'GET',
      path: '/route-plan',
      queryStringParameters: {
        fromPlace: '60.148156622692035,24.987887975719225',
        toPlace: '60.19461994799159,24.870836734771732',
        time: '8:40am',
        date: `${month}-${day}-${year}`,
        mode: 'TRANSIT',
      },
    };

    const context = {};
    const response = await getRoutePlan(event, context);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toMatchSchema(responseSchema);
  });

  it('GET [/route-plan] should return the expected response 400', async () => {
    const event = {
      httpMethod: 'GET',
      path: '/route-plan',
      queryStringParameters: {
      
      },
    };
    const context = {};
    const response = await getRoutePlan(event, context);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty('error');
  });

  it('GET [/route-plan] should return the expected response 404', async () => {
    const event = {
      httpMethod: 'GET',
      path: '/',
    };
    const context = {};
    const response = await getRoutePlan(event, context);
    expect(response.statusCode).toBe(404);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty('error');
  });
});

