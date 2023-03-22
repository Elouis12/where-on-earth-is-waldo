const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const cors = require("cors");
const { db } = require("./config/db");
const { establishSocketConnection } = require('./ServerSocket')



dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded( { extended: true } ) );

app.use( cors() );
app.enable('trust proxy');

// render index file
app.use( express.static('./public') );
app.use( express.static('public') );
// app.use(express.static(path.join(__dirname, 'public')));


// add favicon
app.use(favicon(path.join(__dirname, 'public', '/assets/images/favicon.ico')))



// user authentication routes
let userAuth = require('./routes/userAuthRoutes.js');
app.use('/auth', userAuth);


// socket files (make sure to have at the bottom or else 404 won't run properly )
let socketRoutes = require('./routes/SocketRoutes');
app.use('/session', socketRoutes);

// application files (make sure to have at the bottom or else 404 won't run properly )
let application = require('./routes/applicationRoutes.js');
app.use('/', application);





// ESTABLISH SOCKET CONNECTION

const http = require('http');
const server = http.createServer(app);
establishSocketConnection(server);

//------------------------


// START SERVER
/*app*/server.listen(process.env.PORT, ()=>{

    console.log(`listening on port ${process.env.PORT}`)

    // connect to the db
/*        db.getConnection(
            err => {
                if (err) {

                    console.error(`ERROR connecting to db -> ${err}`);

                }else{
                    console.log( 'connected to the db' );

                }
            }
            );*/
})

