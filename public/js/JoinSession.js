import {SocketAPI} from '../js/SocketAPI.js';

let socketAPI = new SocketAPI();


export async function validID(sessionID){

    let url = `/session?id=${sessionID}&`;

    // if room is valid
    if( !await socketAPI.validRoom(sessionID) ){

        window.location.href = url + 'issue=invalid';

    }else if( await socketAPI.gameStarted(sessionID) ){

        window.location.href = url + 'issue=game-started';

    }else if( await socketAPI.roomFull(sessionID) ){

        window.location.href = url + 'issue=full';

    }

}



export async function joinSession() {

    // redirect - is an argument that determines if we should redirect
    // depending if user went through /play/join or session?id=1234

    let sessionID = document.getElementById("join-input").value;
    let usernameInputContainer = document.getElementById("name-input").closest('.input-container-items');



    let idReturned = await socketAPI.validID(sessionID);

    // get user info
    let userInfo = await fetch(

        "/auth/user-info",
        {
            method: 'POST',
            headers : {

                'Content-type' : 'application/json'
            },
            body : JSON.stringify({
                refreshToken: localStorage.getItem("refreshToken")
            })
        }
    ).then(
        resp => resp.json()
    ).catch(
        (e)=> console.log(e)
    );

    // USER IS NOT LOGGED IN AND THE USER NAME INPUT BOX IS SHOWN
    if( !usernameInputContainer.classList.contains('hideVisibility') ){

        let username = document.getElementById("name-input").value;

        let validUsername = await socketAPI.validRoomName(username, sessionID);

        // room id is valid and username is valid
        if( idReturned !== "" && validUsername ){


            // store user name in db or in the socket
            localStorage.setItem('session-name', document.getElementById("name-input").value );


            if( window.location.href.includes("play/join") ){

                // take user to the waiting room
                window.location.href = `/session?id=${idReturned}`;

            }

            return true;

        }

        alert('not a valid room id or user name')
        return false;

    // INPUT BOX IS NOT SHOWN WHICH MEANS USER IS LOGGED IN
    }else if( userInfo.restricted === undefined || userInfo.restricted === null ){

        // room id is valid
        if( idReturned !== "" ){

            // store user name in db or in the socket
            localStorage.setItem('session-name', userInfo[0].user_name );

            // take user to the waiting room
            window.location.href = `/session?id=${idReturned}`;

            return true;
        }

        alert('not a valid room id')

        return false;


    }


}

export async function displayNameInput(){

        // verify user is logged in
        let userInfo = await fetch(

            "/auth/user-info",
            {
                method: 'POST',
                headers : {

                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({
                    refreshToken: localStorage.getItem("refreshToken")
                })
            }
        ).then(
            resp => resp.json()
        ).catch(
            (e)=> console.log(e)
        );


        // user not logged in
        if( !userInfo.restricted /* === 'restricted'*/ ){

            // let user input username
            document.getElementById("name-input").closest('.input-container-items').classList.add('hideVisibility');

        }

}

export async function updateNav(){

    // verify user is logged in
    let userInfo = await fetch(

        "/auth/user-info",
        {
            method: 'POST',
            headers : {

                'Content-type' : 'application/json'
            },
            body : JSON.stringify({
                refreshToken: localStorage.getItem("refreshToken")
            })
        }
    ).then(
        resp => resp.json()
    ).catch(
        (e)=> console.log(e)
    );

    // load nav content
    let navMenu = document.getElementById('nav-menu');

    // if user exists, display their name and remove sign up button
    if( userInfo.length > 0 && navMenu != null ){

        navMenu.innerHTML = `
                
                <li id="home-nav-item" class="" onclick="window.location ='/'"><img class="home-img" src="../assets/images/favicon.ico" alt=""></li>
                <li id="stats-nav-item" class="nav-items" onclick="window.location ='/stats'">Stats</li>
                <li id="about-nav-item" class="nav-items" onclick="window.location ='/about'">About</li>
                <li id="settings-nav-item" class="nav-items" onclick="window.location ='/settings'">Settings</li>
            
                `;

    }else /*if( userInfo.length <= 0 && navMenu != null )*/{

        navMenu.innerHTML = `
                
                <li id="home-nav-item" class="" onclick="window.location ='/'"><img class="home-img" src="../assets/images/favicon.ico" alt=""></li>
                <li id="signup-nav-item" class="nav-items" onclick="window.location ='/register'">Sign Up</li>
                <li id="login-nav-item" class="nav-items" onclick="window.location ='/login'">Login</li>
                <li id="about-nav-item" class="nav-items" onclick="window.location ='/about'">About</li>
            
            `;
    }
}