'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/shelf';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-shelf';
exports.PORT = process.env.PORT || 8080;