// MongoDB initialization script
db = db.getSiblingDB('rentalapp');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        },
        password: {
          bsonType: "string",
          minLength: 6
        }
      }
    }
  }
});

db.createCollection('vehicles', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["brand", "model", "year", "pricePerDay"],
      properties: {
        brand: {
          bsonType: "string"
        },
        model: {
          bsonType: "string"
        },
        year: {
          bsonType: "int",
          minimum: 1900,
          maximum: 2030
        },
        pricePerDay: {
          bsonType: "number",
          minimum: 0
        }
      }
    }
  }
});

db.createCollection('bookings', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["vehicle", "customer", "startTime", "endTime"],
      properties: {
        vehicle: {
          bsonType: "objectId"
        },
        customer: {
          bsonType: "objectId"
        },
        startTime: {
          bsonType: "date"
        },
        endTime: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.vehicles.createIndex({ "brand": 1, "model": 1 });
db.vehicles.createIndex({ "location": "2dsphere" });
db.bookings.createIndex({ "vehicle": 1, "startTime": 1, "endTime": 1 });
db.bookings.createIndex({ "customer": 1 });

print('MongoDB initialization completed successfully');
