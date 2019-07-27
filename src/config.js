// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

require('dotenv').config();

module.exports = {
    logging: {
        request: true,
        requestObjects: [
          'request'
        ],
        response: true,
        responseObjects: [
          'response.outputSpeech.ssml'
        ],
    },
    intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.CancelIntent': 'END',
        'AMAZON.NoIntent': 'END',
        'AMAZON.YesIntent': 'YesIntent',
        'AMAZON.HelpIntent': 'HelpIntent',
     },
    custom: {
        aurora: {
            awsConfig: {
                accessKeyId: process.env.AURORA_ACCESS_KEY_ID,
                secretAccessKey: process.env.AURORA_SECRET_ACCESS_KEY, 
                region:  process.env.AURORA_REGION,
            },
            secret: {
                arn: process.env.AURORA_SECRET_ARN, 
            },
            cluster: {
                arn: process.env.AURORA_CLUSTER_ARN, 
            },
            database: {
                name: process.env.AURORA_DATABASE_NAME,
            },
            scores: {
                tableName: 'scores',
                primaryKeyColumn: 'id',
                scoreColumnName: 'score',
            },
        },
        game: {
            numberOfDice: 10,
            sidesPerDice: 6,
        },
    },
 };
 