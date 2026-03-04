const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if we have a MySQL URL (Render provides DATABASE_URL)
if (process.env.DATABASE_URL) {
  // Use MySQL with full URL (for Render and other cloud platforms)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  console.log('Using MySQL database with URL');
} else if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
  // Use MySQL with individual credentials (for Aiven)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'defaultdb',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
  console.log('Using MySQL database with credentials');
} else {
  // SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  console.log('Using SQLite database for development');
}

module.exports = sequelize;
