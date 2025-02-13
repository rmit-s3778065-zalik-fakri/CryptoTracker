const AWS = require('aws-sdk')
AWS.config.update({
    region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'Crypto';
const cryptoPath = '/crypto';
const cryptosPath = '/cryptos';

exports.handler = async function(event) {
    console.log('Request event:',  event);
    let response;
    switch(true) {
        case event.httMethod === 'GET' && event.path === cryptosPath:
            response = await getCryptos();
            break;
        case event.httpMethod === 'GET' && event.path === cryptoPath:
            response = await getCrypto(event.queryStringParameters.ticket);
            break;
        case event.httpMethod === 'POST' && event.path === cryptoPath:
                response = await saveCrypto(JSON.parse(event.body));
                break;
        case event.httpMethod === 'PATCH' && event.path === cryptoPath:
                const requestBody = JSON.parse(event.body);
                response = await modifyCrypto(requestBody.ticket, requestBody.updateKey, requestBody.updateValue);
                break;
        case event.httpMethod === 'DELETE' && event.path === cryptoPath:
                response = await deleteCrypto(JSON.parse(event.body).ticket);
                break;
        default:
                response = buildResponse(404, '404 Not Found ');
    }
    return response;
}

async function scanDynamoRecords(scanParams, itemArray) {
    try {
      const dynamoData = await dynamodb.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch(error) {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    }
}


// get all crypto
async function getCryptos() {
    const params = {
      TableName: dynamodbTableName
    }
    const allCryptos = await scanDynamoRecords(params, []);
    const body = {
      cryptos: allCryptos
    }
    return buildResponse(200, body);
}

// get one item
async function getCrypto(ticket) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'ticket': ticket
      }
    }
    return await dynamodb.get(params).promise().then((response) => {
      return buildResponse(200, response.Item);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    });
  }

// save crypto
  async function saveCrypto(requestBody) {
    const params = {
      TableName: dynamodbTableName,
      Item: requestBody
    }
    return await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: requestBody
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }


// update crypto
  async function modifyCrypto(ticket, updateKey, updateValue) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'ticket': ticket
      },
      UpdateExpression: `set ${updateKey} = :value`,
      ExpressionAttributeValues: {
        ':value': updateValue
      },
      ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
      const body = {
        Operation: 'UPDATE',
        Message: 'SUCCESS',
        UpdatedAttributes: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }

// delete crypto
  async function deleteCrypto(ticket) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'ticket': ticket
      },
      ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
      const body = {
        Operation: 'DELETE',
        Message: 'SUCCESS',
        Item: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }


  function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }