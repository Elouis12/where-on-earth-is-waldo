const mysql = require('mysql2');
const dotEnv = require("dotenv");
dotEnv.config();


const db = mysql./*connect*/createPool( {

    connectionLimit : 1,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB



} );


module.exports = { db };

