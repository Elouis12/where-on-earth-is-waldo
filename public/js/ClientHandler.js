// import { io } from '.../socket.io/client-dist/socket.io';
// import { io } from '../../../application/node_modules/socket.io/client-dist/socket.io.js';


export class ClientHandler {


    // establish a client socket
    #socket;

    #sessionID = window.location.href.split("=")[1];


    #users = 0;

    constructor(connectionURL) {

        // this.#socket = io(connectionURL);
        this.#socket = io();


        this.#socket.emit('connected', { sessionID : this.#sessionID, username : localStorage.getItem('session-name') } );

        // send back data to server of the connected user in the room
        this.#socket.emit('get-game-options', this.#sessionID)
        this.#socket.on('store-game-options', (gameOptions)=>{

            // don't stringify it, it's already a string coming from the db as we stringifies it when clicking 'play with friends'
            localStorage.setItem("game-options", gameOptions);
            setOptions();
        })


        this.#socket.on('start', ()=>{

            // disabling the button prevents the infinite loop of client keep clicking the session start button
            // reason is, once we send a message to click start, the start button has another event that tells other sockets to start and it feeds the loop

            document.getElementById('session-start-button').click();
            // disable the button
            document.getElementById('session-start-button').disabled = true;
            // set player's scores
            this.setPlayersScore()

        });


        this.#socket.emit('sessionID', this.#sessionID);


        this.#socket.on('full', (sessionID)=>{

            window.location.href = `/session?id=${sessionID}&issue=full`

        })

        this.#socket.on('invalid-id', (sessionID)=>{

            window.location.href = `/session?id=${sessionID}&issue=issue=invalid`

        })

        this.#socket.on('game-started', (sessionID)=>{

            window.location.href = `/session?id=${sessionID}&issue=game-started`

        })

        this.#socket.on('user-connected', (usernames)=>{

            this.updatePlayerList(usernames)

        })


        // UPDATE USERS IN ROOM
        this.#socket.on('users', (clients) => {

            this.setUsers(clients);

        });

        // SORT SCORES
        this.#socket.on("sorted-scores", (data)=>{

            // update player's list
            let listItems = document.getElementById('slide');

            // clear any previous ones so it doesn't keep adding to it
            listItems.innerText = "";

            for( let x = 0; x < data.scores.length; x++ ){

                let item;

                // the current user
                if( data.scores[x].username === localStorage.getItem('session-name') ){

                    item = `<li><span class="player-name current-player">${data.scores[x].username}</span> <span id="${data.scores[x].username}" class="player-score">${data.scores[x].score}</span></li>`

                }else{

                    item = `<li><span class="player-name other-players">${data.scores[x].username}</span> <span id="${data.scores[x].username}" class="player-score">${data.scores[x].score}</span></li>`

                }
                listItems.insertAdjacentHTML('beforeend', item);

            }

            // winner, let globe know to stop dots form being clicked,
            // let users who are logged in save their win, if they win
            if( data.gameOver ){

                // send user who won
                this.#socket.emit("winner", { sessionID : this.#sessionID, username : data.scores[0].username } );

                // send an event to remove all users in current session and the session itself
            }

        })

        // get winner
        this.#socket.on("get-winner", (winner)=>{

            // show div
            document.getElementById("winner-container").style.visibility = "visible";
            document.getElementById("winner").innerText = winner + "";

            // hide hints container
            document.getElementById("hints-container").style.display = "none";

        })

        // update list after current user has been removed
        this.#socket.on('user-removed', (user)=>{


/*
            // delete the user from db
            this.#socket.emit('close', { sessionID : this.#sessionID, username : user });
*/

            // remove the user from the list of people
            let players = document.getElementsByClassName('player-name');

            for( let x = 0; x < players.length; x++ ){

                if( players[x].innerText === user ){

                    players[x].parentElement.remove();
                }
            }


            // decrease users count
            let users = document.getElementById('users');
            users.innerText = parseInt(users.innerText-1);


        })


        // when user exits the tab
        window.addEventListener('load', ()=>{

                this.closeConnection();

        });

    }

    getSocket(){

        return this.#socket;
    }

    setUsers(users){

        this.#users = users;

        // update users count html
        document.getElementById("users").innerText = users;

    }

    updatePlayerList(usernames){


        // update player's list
        let listItems = document.getElementById('slide');

        // clear any previous ones so it doesn't keep adding to it
        listItems.innerText = "";

        let names = Object.keys(usernames);

        for( let x = 0; x < names.length; x++ ){

            let item;

            if( usernames[x].username === localStorage.getItem('session-name') ){

                item = `<li><span class="player-name current-player">${usernames[x].username}</span> <span id="${usernames[x].username}" class="player-score"></span></li>`

            }else{

                item = `<li><span class="player-name other-players">${usernames[x].username}</span> <span id="${usernames[x].username}" class="player-score"></span></li>`

            }

            listItems.insertAdjacentHTML('beforeend', item);

        }
    }


    setPlayersScore(){

        // update player's scores
        let playerScores = document.getElementsByClassName('player-score');
        let foundScore = document.getElementById('found-count');

        for( let x = 0; x < playerScores.length; x++ ){

            playerScores[x].innerText = foundScore.innerText;

        }
    }

    getUsers(){

        return this.#users;
    }

    closeConnection() {

        // reduce the count
/*        await fetch(
            'http://localhost:5000/session/reduce-user-count',
            {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    sessionID: this.#sessionID,
                })
            }
        ).then(
            resp => resp.json()
        ).catch(
            (e) => {
                console.log(e)
            }
        );*/


        // remove current user from db
        this.#socket.emit('close', { sessionID : this.#sessionID, username : localStorage.getItem("session-name") });



    }

}
