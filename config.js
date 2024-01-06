const config = {
  appConfig: {
    host: process.env.HOST,
    port: process.env.PORT || 5000,
    testPort: process.env.TEST_PORT || 5002,
  },
  dbUrl: process.env.DB_URL,
  dbTest: process.env.DB_TEST,
};
module.exports = config;
