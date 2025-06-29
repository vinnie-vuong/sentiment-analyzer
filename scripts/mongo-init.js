// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the sentiment_analyzer database
db = db.getSiblingDB('sentiment_analyzer');

// Create a user for the application
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'sentiment_analyzer'
    }
  ]
});

// Create collections with validation
db.createCollection('analyses', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['text', 'label', 'confidence', 'score', 'createdAt'],
      properties: {
        text: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        label: {
          enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
          description: 'must be one of the enum values and is required'
        },
        confidence: {
          bsonType: 'double',
          minimum: 0,
          maximum: 1,
          description: 'must be a number between 0 and 1 and is required'
        },
        score: {
          bsonType: 'object',
          required: ['positiveScore', 'negativeScore', 'neutralScore'],
          properties: {
            positiveScore: {
              bsonType: 'double',
              minimum: 0,
              maximum: 1
            },
            negativeScore: {
              bsonType: 'double',
              minimum: 0,
              maximum: 1
            },
            neutralScore: {
              bsonType: 'double',
              minimum: 0,
              maximum: 1
            }
          }
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date and is required'
        }
      }
    }
  }
});

// Create indexes for better performance
db.analyses.createIndex({ "createdAt": -1 });
db.analyses.createIndex({ "label": 1 });
db.analyses.createIndex({ "text": "text" });

print('MongoDB initialization completed successfully!');
print('Database: sentiment_analyzer');
print('Collection: analyses');
print('User: app_user'); 