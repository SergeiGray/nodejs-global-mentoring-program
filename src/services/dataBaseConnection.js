import { Sequelize } from "sequelize";

const connection = new Sequelize(process.env.DB_URI, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

connection
    .authenticate()
    .then(() => {
        console.info("INFO - Database connected.")
    })
    .catch((err) => {
        console.error("ERROR - Unable to connect to the database:", err)
    })

export default connection;
