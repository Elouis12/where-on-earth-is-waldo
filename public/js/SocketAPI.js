export class SocketAPI {

    async createSession(){

        let create = await fetch()
    }


    async validID(id){

        // make fetch to check if id exists and returns it

       let sessionID = await fetch(

           'http://localhost:5000/session/validID',
           {
               method : 'POST',
               headers: { "Content-Type": "application/json" },
               body : JSON.stringify({
                   id : id,
               })
           }

        ).then(

            resp => resp.json()

        ).catch(

            (e) => { console.log(e) }
        );

       return sessionID;
    }


    async validRoomName(sessionName, sessionID){

        // make fetch to check if room id exists and returns it

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

        let isLoggedIn = userInfo.length > 0;

       let roomNameValid = await fetch(

           'http://localhost:5000/session/valid-room-name',
           {
               method : 'POST',
               headers: { "Content-Type": "application/json" },
               body : JSON.stringify({
                   sessionName : sessionName,
                   sessionID : sessionID,
                   isLoggedIn : isLoggedIn,
               })
           }

        ).then(

            resp => resp.json()

        ).catch(

            (e) => { console.log(e) }
        );

       return roomNameValid;
    }


    async validRoom(sessionID){

        // make fetch to check if room id exists and returns it

        let roomValid = await fetch(

            'http://localhost:5000/session/valid-room',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    sessionID : sessionID,
                })
            }

        ).then(

            resp => resp.json()

        ).catch(

            (e) => { console.log(e) }
        );

        return roomValid;
    }

    async roomFull(sessionID){

        let roomIsFull = await fetch(

            'http://localhost:5000/session/room-full',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    sessionID : sessionID,
                })
            }

        ).then(

            resp => resp.json()

        ).catch(

            (e) => { console.log(e) }
        );

        return roomIsFull;

    }


    async gameStarted(sessionID){

        let started = await fetch(

            'http://localhost:5000/session/game-started',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    sessionID : sessionID,
                })
            }

        ).then(

            resp => resp.json()

        ).catch(

            (e) => { console.log(e) }
        );

        return started;

    }

}