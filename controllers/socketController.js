let {db} = require('../config/db.js');
let {query} = require('../models/userModel.js');


let updateUsers = async (users, sessionID)=>{

    let sql = `
        
        UPDATE sessions SET users = ${users} WHERE session_id = '${sessionID}'
        
    `

    return new Promise((resolve, reject)=>{

        db.query(sql, (err, result)=>{

            if(err){

                reject(err);
            }else{

                resolve(result);
            }
        })

    });
}

let getUsers = async (sessionID)=>{

    let sql = `
        
        SELECT users from sessions WHERE session_id = '${sessionID}'
        
    `

    return new Promise((resolve, reject)=>{

        db.query(sql, (err, result)=>{

            if(err){

                reject(err);
            }else{

                let total = result.length > 0 ? result[0].users : result.length;

                resolve(total);
            }
        })

    });
}


let roomInvalid = async (sessionID)=>{

    let sql = `
        
        SELECT session_id from sessions WHERE session_id = '${sessionID}'
        
    `
    return new Promise((resolve, reject)=>{

        db.query(sql, (err, result)=>{

            if(err){

                reject(err);
            }else{

                let total = result.length <= 0;

                resolve(total);
            }
        })

    });
}

let createSessionId = ()=>{

    let lettersArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    let numbersArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    // create session id
    let sessionID = '';

    for( let x = 0; x < 5; x++ ){

        let arrayOrNumber = Math.floor( Math.random() * 2 + 1 );

        arrayOrNumber === 1 ?
            sessionID += lettersArray[ Math.floor( Math.random() * 26 ) ]
            :
            sessionID += numbersArray[ Math.floor( Math.random() * 10 ) ]

    }

    return sessionID;

}
let sessionIdExists = (sessionId)=>{

    return new Promise((resolve, reject) => {
        let sql = `SELECT session_id FROM sessions WHERE session_id = '${sessionId}'`;
        db.query(sql, function (err, result) {

            if (err) {
                reject(err);
            }

            resolve(result)
        })
    })
}

let reduceUserCount = async (req, resp) => {

    let {sessionID} = req.body;

    let users = await getUsers(sessionID).then(result => result);

    await updateUsers(--users, sessionID);
}

let createSession = async (req, resp) => {

    let {gameOptions} = req.body;
    // create session ID
    let sessionID = createSessionId();
    let valid = await sessionIdExists(sessionID).then(result => result);

    // check if room not taken
    while (valid.length > 0) {

        sessionID = createSessionId();

        valid = await sessionIdExists(sessionID).then(result => result);

    }

    console.log(gameOptions)

    // save to db
    let sql = `
                
                INSERT INTO sessions(session_id, users, max_users, game_options, started)
                VALUES('${sessionID}', 0, 10, '${gameOptions}', 0 )
            `
    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

        }else{

            // send session id back to client to redirect
            resp.json(sessionID);
        }

    });
}

let validID = async (req, resp) => {

    let {id} = req.body;

    let idExists = await sessionIdExists(id).then(result => result);

    resp.json(
        (

        idExists.length > 0?
            idExists[0].session_id : ""
        )
    );

}

let validRoomName = async (req, resp) => {

    let {sessionName, sessionID, isLoggedIn} = req.body;

    let sessionNameSQL = `
        
        SELECT username FROM users_in_session
        WHERE username = '${sessionName}' AND session_id = '${sessionID}'
    `

    let registeredNameSQL = `
        
        SELECT user_name FROM users
        WHERE user_name = '${sessionName}'
    `
    let roomNameExistsInSession = await query(sessionNameSQL).then(result => result);
    let roomNameExistsAsRegisteredUser = await query(registeredNameSQL).then(result => result);


    if( sessionName === ""
            ||
        ( roomNameExistsAsRegisteredUser.length > 0 && !isLoggedIn ) // user is not logged in and tries to use a registered user's username
            ||
        roomNameExistsInSession.length > 0
         ){

        resp.json( false );

    }else{

        resp.json( true );
    }


}

let validRoom = async (req, resp) => {

    let {sessionID} = req.body;

    let sql = `
        
        SELECT session_id FROM sessions
        WHERE session_id = '${sessionID}'
    `
    let roomExists = await query(sql).then(result => result);


    if( roomExists.length > 0 ){

        resp.json( true );

    }else{

        resp.json( false );
    }


}

let gameStarted = async (req, resp) => {

    let {sessionID} = req.body;

    let sql = `
        
        SELECT started 
        FROM sessions 
        WHERE session_id = '${sessionID}'
            AND
            started = 1
    
    `
    let gameStarted = await query(sql).then(result => result);


    if( gameStarted.length > 0 ){

        resp.json( true );

    }else{

        resp.json( false );
    }


}

let roomFull = async (req, resp) => {

    let {sessionID} = req.body;

    let sql = `
        
        SELECT session_id 
        FROM sessions 
        WHERE users >= max_users 
            AND 
            session_id = '${sessionID}';        
    `

    let isFull = await query(sql).then(result => result);


    if( isFull.length > 0  ){

        resp.json( true );

    }else{

        resp.json( false );
    }


}

let removeUser = async (sessionID, username)=>{

    let sql = `
        
        DELETE FROM users_in_session 
        WHERE session_id = '${sessionID}'
            AND
            username = '${username}' 
    `

    await query(sql);
}


module.exports = { createSession,
    validID,
    updateUsers,
    getUsers,
    roomInvalid,
    reduceUserCount,
    validRoomName,
    removeUser,
    validRoom,
    gameStarted,
    roomFull
}