// MongoDB initialization script
db = db.getSiblingDB('skillbridge');

// Create collections
db.createCollection('users');
db.createCollection('resumes');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.resumes.createIndex({ "userId": 1 });
db.resumes.createIndex({ "createdAt": -1 });

print('Database initialized successfully');