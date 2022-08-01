const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();


app.use( express.static('./public') );

/*
app.get('/', (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/index.html') );
})
*/


app.get('/play', (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/play.html') );
})



app.listen(process.env.PORT, ()=>{

    console.log(`listening on port ${process.env.PORT}`)
})