'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/shelf'; // localhost or 127.0.0.1
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-shelf';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'badatheetathaytheeban12345';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
