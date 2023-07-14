module.exports.OPEN_TRIP_PLANNER_URL = process.env.OPEN_TRIP_PLANNER_URL;

module.exports.API_KEY = process.env.API_KEY;

module.exports.co2Multipliers = {
  AIRPLANE: 144,
  BICYCLE: 0,
  BICYCLE_RENT: 0,
  BUS: 74,
  CAR: 160,
  ESCOOTER: 110,
  FERRY: 144,
  FUNICULAR: 54,
  METRO: 54,
  PUBLIC_TRANSIT: 74,
  RAIL: 14,
  SCOOTER: 75,
  SHARED_BICYCLE: 0,
  SUBWAY: 74,
  TAXI: 250,
  TRAIN: 14,
  TRAM: 54,
  WAIT: 0,
  WALK: 0,
};

module.exports.datePattern =
  /^(\d{4})-(0[1-9]|1[012])-([0-2][1-9]|3[01])T([01]\d|2[0123]):([0-5]\d):([0-5]\d)(\.\d+)?(Z|([+-]([01]\d|2[0123]):[0-5]\d))$/;

module.exports.responseSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    plan: {
      type: 'object',
      properties: {
        from: {
          type: 'object',
          properties: {
            coordinates: {
              type: 'array',
              items: [
                {
                  type: 'number',
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['coordinates'],
        },
        to: {
          type: 'object',
          properties: {
            coordinates: {
              type: 'array',
              items: [
                {
                  type: 'number',
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['coordinates'],
        },
        itineraries: {
          type: 'array',
          maxItems: 5,
          items: [
            {
              type: 'object',
              properties: {
                co2: {
                  type: 'number',
                },
                distance: {
                  type: 'number',
                },
                startTime: {
                  type: 'string',
                  pattern:
                    '^\\d{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\\d)|(3[01]))T(([01]\\d)|(2[0123])):([012345]\\d):([012345]\\d)(\\.\\d+)?(Z|([\\+\\-]([01]\\d|2[0123]):[012345]\\d))$',
                },
                endTime: {
                  type: 'string',
                  pattern:
                    '^\\d{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\\d)|(3[01]))T(([01]\\d)|(2[0123])):([012345]\\d):([012345]\\d)(\\.\\d+)?(Z|([\\+\\-]([01]\\d|2[0123]):[012345]\\d))$',
                },
                duration: {
                  type: 'integer',
                },
                legs: {
                  type: 'array',
                  items: [
                    {
                      type: 'object',
                      properties: {
                        mode: {
                          type: 'string',
                        },
                        routeShortName: {
                          type: 'string',
                        },
                        distance: {
                          type: 'number',
                        },
                        co2: {
                          type: 'number',
                        },
                      },
                      required: ['mode', 'distance', 'co2'],
                    },
                  ],
                },
              },
              required: [
                'co2',
                'distance',
                'startTime',
                'endTime',
                'duration',
                'legs',
              ],
            },
          ],
        },
      },
      required: ['from', 'to', 'itineraries'],
    },
  },
  required: ['plan'],
};
