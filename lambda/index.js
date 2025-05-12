const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.LEADERBOARD_TABLE;

// Credenciais de teste conforme solicitado no desafio
const TEST_CREDENTIALS = {
    admin: {
        username: 'admin',
        password: '2025DEVChallenge'
    },
    user: {
        username: 'newuser',
        password: '2025DEVChallenge'
    }
};

exports.handler = async (event) => {
    try {
        // Set CORS headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
        };
        
        // Handle OPTIONS requests (CORS preflight)
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'CORS enabled' })
            };
        }
        
        // Handle GET request - retrieve leaderboard
        if (event.httpMethod === 'GET') {
            const params = {
                TableName: TABLE_NAME,
                Limit: 10,
                ScanIndexForward: false, // Sort in descending order
            };
            
            // If using a GSI for sorting by score
            if (event.queryStringParameters && event.queryStringParameters.top) {
                params.IndexName = 'ScoreIndex';
                params.Limit = parseInt(event.queryStringParameters.top) || 10;
            }
            
            const result = await dynamoDB.scan(params).promise();
            
            // Sort by score (highest first)
            const sortedItems = result.Items.sort((a, b) => b.score - a.score).slice(0, params.Limit);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(sortedItems)
            };
        }
        
        // Handle POST request - add new score
        if (event.httpMethod === 'POST') {
            const requestBody = JSON.parse(event.body);
            
            // Validate required fields
            if (!requestBody.playerName || !requestBody.score) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ message: 'playerName and score are required' })
                };
            }
            
            // Validate credentials if provided
            if (requestBody.username && requestBody.password) {
                const isAdmin = requestBody.username === TEST_CREDENTIALS.admin.username && 
                               requestBody.password === TEST_CREDENTIALS.admin.password;
                
                const isUser = requestBody.username === TEST_CREDENTIALS.user.username && 
                              requestBody.password === TEST_CREDENTIALS.user.password;
                
                if (!isAdmin && !isUser) {
                    return {
                        statusCode: 401,
                        headers,
                        body: JSON.stringify({ message: 'Invalid credentials' })
                    };
                }
                
                // Add role to the record
                requestBody.role = isAdmin ? 'admin' : 'user';
            }
            
            const timestamp = new Date().toISOString();
            const id = `${requestBody.playerName}-${timestamp}`;
            
            const params = {
                TableName: TABLE_NAME,
                Item: {
                    id: id,
                    playerName: requestBody.playerName,
                    score: requestBody.score,
                    timestamp: timestamp,
                    role: requestBody.role || 'guest' // Default to guest if no credentials
                }
            };
            
            await dynamoDB.put(params).promise();
            
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ message: 'Score added successfully', id })
            };
        }
        
        // Handle unsupported methods
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method not allowed' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ message: 'Internal server error', error: error.message })
        };
    }
};
