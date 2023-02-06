const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const cors = require("cors");
const { db } = require("./config/db");
const mjml = require('mjml');



dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded( { extended: true } ) );

app.use( cors() );


const htmlOutput = mjml(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`)

/*
  Print the responsive HTML generated and MJML errors if any
*/
console.log(htmlOutput.html)

// render index file
app.use( express.static('./public') );

// add favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


// user authentication routes
let userAuth = require('./routes/userAuthRoutes.js');
app.use('/auth', userAuth);


// application files (make sure to have at the bottom or else 404 won't run properly )
let application = require('./routes/applicationRoutes.js');
app.use('/', application);



app.listen(process.env.PORT, ()=>{

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