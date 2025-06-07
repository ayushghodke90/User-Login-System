const { Sequelize } = require('sequelize');
const config = require('./config/database').development;

async function createDatabase() {
  // Connect to postgres database first
  const tempSequelize = new Sequelize('postgres', config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: console.log
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await tempSequelize.authenticate();
    console.log('Connected successfully!');

    // Check if database exists
    const [results] = await tempSequelize.query(
      "SELECT 1 FROM pg_database WHERE datname = 'userLoginSystem'"
    );

    if (results.length === 0) {
      console.log('Creating database userLoginSystem...');
      await tempSequelize.query('CREATE DATABASE "userLoginSystem"');
      console.log('Database created successfully!');
    } else {
      console.log('Database userLoginSystem already exists.');
    }

  } catch (error) {
    console.error('Error:', {
      name: error.name,
      message: error.message,
      code: error.original?.code,
      detail: error.original?.detail
    });

    if (error.original?.code === '28P01') {
      console.error('\nInvalid password for PostgreSQL user. Please check your password in config/database.js');
    } else if (error.original?.code === 'ECONNREFUSED') {
      console.error('\nCould not connect to PostgreSQL. Please make sure:');
      console.error('1. PostgreSQL service is running');
      console.error('2. PostgreSQL is installed correctly');
      console.error('3. Port 5432 is not blocked');
    }
  } finally {
    await tempSequelize.close();
  }
}

createDatabase(); 