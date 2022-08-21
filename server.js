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


app.get('/about', (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/about.html') );
})


app.get('/play', (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/play.html') );
})


app.all('/*', (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/404.html') );

})



app.listen(process.env.PORT, ()=>{

    console.log(`listening on port ${process.env.PORT}`)
})