import { Sequelize } from "sequelize";
import mysql from "mysql";

// const {Sequelize} = require("sequelize");
// const mysql = require("mysql2");
// const {Feed} = require("./migrate");

async function getConnection(name:String, level=1): Promise<Sequelize|null> {
    const sequelize = new Sequelize(
        `simplefeed_${name}`,
        'python',
        'python',
         {
           host: 'localhost',
           dialect: 'mysql'
         }
    );
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize;
    }catch (error){
        console.error('Unable to connect to the database: ', error);
        createDatabase(name);
        console.log(level);
        if(level < 2){
            return await getConnection(name, level + 1);
        }
        return null;
    }
}

function createDatabase(name: String){
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
    });
    console.log('create Database');
    connection.query(
        `CREATE DATABASE IF NOT EXISTS simplefeed_${name}`,
        function (err, results) {
            console.log(results);
            console.log(err);
        }
    );
    console.log("Give priviledges");
    connection.query(
        `GRANT ALL PRIVILEGES ON simplefeed_${name}.* TO 'python'@'localhost'`,
        function (err, results) {
            console.log(results);
            console.log(err);
        }
    );
    console.log("Flush priviledges");
    connection.query(
        'FLUSH PRIVILEGES',
        function (err, results) {
            console.log(results);
            console.log(err);
        }
    );
    connection.end();    
}

export {getConnection}
// module.exports = {getConnection};