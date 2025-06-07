const { Sequelize } = require('sequelize');
const config = require('./config/database').development;

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Connection config:', {
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username
  });

  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: console.log // Enable logging for this test
    }
  );

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test if we can query the database
    const [results] = await sequelize.query('SELECT current_database(), current_user');
    console.log('Current database info:', results[0]);
    
    // List all tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Available tables:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.original?.code,
      detail: error.original?.detail
    });
  } finally {
    await sequelize.close();
  }
}

testConnection(); 