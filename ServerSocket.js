let socketController = require('./controllers/socketController');
let {query} = require('./models/userModel.js');

let sessionID;

let clients;

let count = 0;

let establishSocketConnection = (server)=>{

    const { Server } = require("socket.io");
    const io = new Server(server);


    // this only runs only if the client (file) has a socket client
    // so if we go to a route without the socket client, the code inside won't run
    io.on('connection', async (socket) => {

        console.log('a socket is being used')

        // STORE THE ROOM NUMBER
        await socket.on('sessionID', async (sessionID) => {

            // establish name for the game room
            // ***** use the session id instead

            clients = await socketController.getUsers(sessionID).then(result => result);

            if( await socketController.roomInvalid(sessionID) ){

                socket.emit('invalid-id', sessionID);

                socket.disconnect();

            }/*else if( await socketController.roomFull(clients, sessionID) ){


                socket.emit('full', sessionID);

                socket.disconnect();

            }*/else{

                await socket.join(sessionID);

            }

            socket.on('disconnect', async () => {

                console.log("SOCKET ID IS " + socket.sessionID);

                io.to(socket.sessionID).emit('user-removed', socket.username);

                console.log(socket.sessionID + " " + socket.username)
                // disconnect calls socket.close()

                clients = await socketController.getUsers(socket.sessionID).then(result => result);

                // decrease count
                await socketController.updateUsers(--clients, socket.sessionID);

                // remove user
                await socketController.removeUser(socket.sessionID, socket.username);

                console.log('client left: ' + clients);

            })

        });


        // A USER CONNECTED
        socket.on('connected', async (data) => {

            await socket.join(sessionID);

            socket.username = data.username;
            socket.sessionID = data.sessionID;


            // ** in an if statement under is full check

            // check if user is logged in and the user name exists as a registred user
            // if (  !data.loggedIn && name in DB users tables )
                    // tell to pick a diff name
            // if ( data.loggedIn && name in DB && name already in session users ){
            //
                    // remove the logged in user and add it again

            // }else{
            //
                    // add user
            // }

            // WAIT!! BEFORE DOING THAT, IF USER-REMOVED SOCKET EVENT ACTUALLY WORKS THEN NO NEED
            // CHEKC DB TO SEE IF THEY'RE BEING REMOVED


            clients = await socketController.getUsers(data.sessionID).then(result => result);

            let sql = `
        
                SELECT started FROM sessions WHERE session_id = '${data.sessionID}'
    
                `
            let gameAlreadyStarted = await query(sql).then( result => result );


            // INVALID ROOM NUMBER
            if( await socketController.roomInvalid(data.sessionID) ){

                socket.emit('invalid-id', data.sessionID);

                socket.disconnect();

            // GAME ALREADY STARTED
            }else if( gameAlreadyStarted[0].started === 1 ){

                socket.emit('game-started', data.sessionID);


                socket.disconnect();

            // ROOM IS FULL
            }/*else if( await socketController.roomFull(clients, sessionID) ){


                socket.emit('full', sessionID);

                socket.disconnect();

            // USER CAN JOIN
            }*/else{

                console.log('a user connected # ' + clients + " @ " + data.sessionID);

                // give socket a new name for the name user gave or the user's account so we can keep track
                socket.username = data.username;

                // update users connected
                await socketController.updateUsers(++clients, data.sessionID);


                // join to a room
                await socket.join(data.sessionID);

                // broadcast how many current users are now in room
                await io.to(data.sessionID).emit('users', clients);


                // store the name in db
                let sql = `
                    
                    INSERT INTO users_in_session(session_id, username)
                    VALUE('${data.sessionID}', '${data.username}')
                `


                await query(sql);

                let getUsernameSQL = `
                    
                    SELECT username 
                    FROM users_in_session 
                    INNER JOIN sessions 
                    ON users_in_session.session_id = sessions.session_id
                    WHERE users_in_session.session_id = '${data.sessionID}' ;
                `

                let usernames = await query(getUsernameSQL).then(result => result).catch((error)=>{ console.log('duplicate name') });

                // let getUserNames = await io.sockets;

                // console.log(usernames);

                // *** FOR NOW, STORE ALL USERS IN DB ACCORDING TO THEIR SESSION NUMBER AND JUST AKE REQUESTS FOR THEM
                // later I want to grab all sockets with their custom id names

                // add the user to the players list
                await io.to(data.sessionID).emit('user-connected', usernames);


            }

        });

        // GET MESSAGE FROM CLIENT OF GAME-OPTIONS ALL USERS WILL PLAY ON
        socket.on('get-game-options', async (sessionID) => {

            // store the game options to use

            let sql = `
                
                SELECT game_options 
                FROM sessions 
                WHERE session_id = '${sessionID}'
            `

            let gameOptions = await query(sql).then(result => result);



            if( gameOptions.length > 0 ){

                console.log('sending ' + gameOptions[0].game_options);

                await socket.join(sessionID);

                socket.emit('store-game-options', gameOptions[0].game_options )

            }

        });

        // GET MESSAGE THAT HOST STARTED CONNECTION
        socket.on('start-session', async (sessionID) => {

            console.log('host started session @' + sessionID);

            // let all clients know to start
            await io.to(sessionID).emit('start');

            // mark in db that the session started
            let sql = `
            
                UPDATE sessions SET started = 1 WHERE session_id = '${sessionID}'
            `
            await query(sql);

        });

        // SORT PLAYER SCORES
        socket.on('update-scores', (data)=>{

            console.log("original " + data.scores);

            // sort scores
            data.scores.sort( (a, b)=>{

                if( parseFloat( a.score ) > parseFloat( b.score ) ){

                    return -1;
                }

                return 1;
            } );

            console.log("updated " + data.scores);
            console.log("game over? " + data.gameOver);

            // send back the sorted scores to all client sockets
            io.to(sessionID).emit('sorted-scores', { scores : data.scores, gameOver : data.gameOver, sender : data.sender });
        })


        // WINNER
        socket.on("winner", (data)=>{

            io.to(data.session).emit("get-winner", data.username);
        })

        // CLOSE CONNECTION
        socket.on('close', async (data) => {


            console.log(data.sessionID + " " + data.username)
            // disconnect calls socket.close()

            clients = await socketController.getUsers(data.sessionID).then(result => result);

            // decrease count
            await socketController.updateUsers(--clients, data.sessionID);

            // remove user
            await socketController.removeUser(data.sessionID, data.username);

            console.log('client left: ' + clients);

        })


    });

}

module.exports = { establishSocketConnection }