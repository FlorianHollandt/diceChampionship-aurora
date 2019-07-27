
const AWS = require('aws-sdk')
const isLambda = require('is-lambda');

const config = require('./config');

if (!isLambda) {
    AWS.config.update(
        {
            region: config.custom.aurora.awsConfig.region,
            accessKeyId: config.custom.aurora.awsConfig.accessKeyId,
            secretAccessKey: config.custom.aurora.awsConfig.secretAccessKey,
        }
    );
}
const RDS = new AWS.RDSDataService()

module.exports = {

    submitScore: function(playerId, score) {
        return new Promise(async (resolve, reject) => {
            try {
                const sqlStatement = `INSERT INTO ${
                    config.custom.aurora.scores.tableName
                } SET ${
                    config.custom.aurora.scores.primaryKeyColumn
                }=${
                    playerId
                }, ${
                    config.custom.aurora.scores.scoreColumnName
                }=${
                    score
                } ON DUPLICATE KEY UPDATE ${
                    config.custom.aurora.scores.scoreColumnName
                }=${
                    score
                }`;
                const parameters = {
                    secretArn: config.custom.aurora.secret.arn,
                    resourceArn: config.custom.aurora.cluster.arn,
                    database: config.custom.aurora.database.name,
                    sql: sqlStatement,
                };
                const query = RDS.executeStatement(
                    parameters,
                    (error, results) => {
                        console.log(`submitScore Result: ${JSON.stringify(results, null, 4)}`);
                        console.log(`submitScore Error: ${JSON.stringify(error, null, 4)}`);
                        if (error) {
                            return reject(error);
                        }
                        resolve(
                            results
                        );
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    },

    getRank: function(score) {
        return new Promise(async (resolve, reject) => {
            try {
                const sqlStatement = `SELECT COUNT(*) FROM ${
                    config.custom.aurora.scores.tableName
                } WHERE ${
                    config.custom.aurora.scores.scoreColumnName
                }>=${
                    score
                }`;
                const parameters = {
                    secretArn: config.custom.aurora.secret.arn,
                    resourceArn: config.custom.aurora.cluster.arn,
                    database: config.custom.aurora.database.name,
                    sql: sqlStatement,
                };
                const query = RDS.executeStatement(
                    parameters,
                    (error, results) => {
                        console.log(`getRank Result: ${JSON.stringify(results, null, 4)}`);
                        console.log(`getRank Error: ${JSON.stringify(error, null, 4)}`);
                        if (error) {
                            return reject(error);
                        }
                        resolve(
                            results.records[0][0].longValue + 1
                        );
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    },

};

