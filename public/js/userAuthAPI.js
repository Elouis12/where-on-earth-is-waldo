export class UserAuthAPI{


    _username;

    _email;

    _password;

    _passwordConfirmation;

    /* SEND USER CREDENTIALS TO BACKEND TO BE EVALUATED */
    async registerUser(e){


/*
        let inputElements = e.target.closest('.register-container').children;

        let inputContainerLength = e.target.closest('.register-container').children[0].children.length;

        let username = inputElements[0].children[ inputContainerLength - 2 ].value;

        let email = inputElements[1].children[ inputContainerLength - 2 ].value;

        let password = inputElements[2].children[ inputContainerLength - 2 ].value;

        let passwordConfirmation = inputElements[3].children[ inputContainerLength - 2 ].value;
*/

        // alert(document.getElementById("username").value)
        /*this._*/ let username = document.getElementById("username").value;

        /*this._*/ let email = document.getElementById("email").value;

        /*this._*/ let password = document.getElementById("password").value;

        /*this._*/ let passwordConfirmation = document.getElementById("password-confirmation").value;


        let message = await fetch(
            'http://localhost:5000/auth/register',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    username : /*this._*/username,
                    email : /*this._*/email,
                    password : /*this._*/password,
                    passwordConfirmation : /*this._*/passwordConfirmation
                })
            }

        ).then( resp => resp.json() )
            .catch( (e) => { console.log(e) } );


        let inputs = document.getElementsByClassName('input-container-items');

        if( message.success ){

            window.location.href = '/login'

        }else{

            if( message.issues.username ){

                inputs[0].children[ 0 ].children[0].style.color = '#ff4c4c';
                inputs[0].children[ 2 ].children[0].classList.remove('hideVisibility');
                // inputs[0].children[ 2 ].children[1].innerText = message.issues.username;

            }else{

                inputs[0].children[ 0 ].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[0].children[ 2 ].children[0].classList.add('hideVisibility');

            }

            if( message.issues.email ){

                inputs[1].children[ 0 ].children[0].style.color = '#ff4c4c';
                inputs[1].children[ 2 ].children[0].classList.remove('hideVisibility');
                inputs[1].children[ 2 ].children[1].innerText = message.issues.email;

            }else{

                inputs[1].children[ 0 ].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[1].children[ 2 ].children[0].classList.add('hideVisibility');

            }

            if( message.issues.password ){

                inputs[2].children[ 0 ].children[0].style.color = '#ff4c4c';
                inputs[2].children[ 2 ].children[0].classList.remove('hideVisibility');

                console.log(message.issues.password)

                inputs[2].children[ 2 ].children[1].innerText = '';
                for( let x = 0; x < message.issues.password.length; x++ ){

                    let item = `<li class="password-issue">${message.issues.password[x]}</li>`;

                    inputs[2].children[ 2 ].children[1].insertAdjacentHTML('beforeend', item);

                }

            }else{

                inputs[2].children[ 0 ].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[2].children[ 2 ].children[0].classList.add('hideVisibility');

            }


            if( message.issues.passwordConfirmation ){

                inputs[3].children[ 0 ].children[0].style.color = '#ff4c4c';
                inputs[3].children[ 2 ].children[0].classList.remove('hideVisibility');
                inputs[3].children[ 2 ].children[1].innerText = message.issues.passwordConfirmation;

            }else{

                inputs[3].children[ 0 ].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[3].children[ 2 ].children[0].classList.add('hideVisibility');

            }

        }


    }


    /* SEND USER CREDENTIALS TO BACKEND TO BE EVALUATED */
    async loginUser(e){

        /*this._*/ let usernameOrEmail = document.getElementById("usernameOrEmail").value;

        /*this._*/ let password = document.getElementById("password").value;


        let message = await fetch(
            'http://localhost:5000/auth/login',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    usernameOrEmail,
                    password
                })
            }

        ).then( resp => resp.json() )
            .catch( (e) => { console.log(e) } );


        let inputs = document.getElementsByClassName('input-container-items');


        if( message.success ){

            // set the tokens
            localStorage.setItem('accessToken', message.accessToken)
            localStorage.setItem('refreshToken', message.refreshToken)
            window.location.href = '/'

        }else {

            if ( message.issue ) {

                // email or username
                inputs[0].children[0].children[0].style.color = '#ff4c4c';
                inputs[0].children[2].children[0].classList.remove('hideVisibility');
                inputs[0].children[2].children[1].innerText = message.issue;

                // password
                inputs[1].children[0].children[0].style.color = '#ff4c4c';
                inputs[1].children[2].children[0].classList.remove('hideVisibility');
                inputs[1].children[2].children[1].innerText = message.issue;

            } else {

                // email or username
                inputs[0].children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[0].children[2].children[0].classList.add('hideVisibility');

                // password
                inputs[0].children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[0].children[2].children[0].classList.add('hideVisibility');

            }

        }

    }



    /* GET USER INFO TO POPULATE GRAPHS AND CHARTS */
    async userInfo(){

        let message = await fetch(
            'http://localhost:5000/auth/user-info',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    refreshToken : localStorage.getItem('refreshToken'),
                })
            }

        ).then( resp => resp.json() )
            .catch( (e) => { console.log(e) } );

        return message;

    }



    async verifyToken(){

        // so the user doesn't see the page while we check to see if they're authorized
        document.body.style.display = 'none';

        let message = await fetch(

            "http://localhost:5000/auth/verify-token",
            {
                method: 'POST',
                headers : {

                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({
                    accessToken: localStorage.getItem("accessToken"),
                    refreshToken: localStorage.getItem("refreshToken")
                })
            }
        ).then(
            resp => resp.json()
        ).catch(
            (e)=> console.log(e)
        );


        // make call to verify token
        if( message === 'unauthorized' ){

            let newAccessToken = await fetch(

                "http://localhost:5000/auth/refresh-token",
                {
                    method: 'POST',
                    headers : {

                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        accessToken: localStorage.getItem("accessToken"),
                        refreshToken: localStorage.getItem("refreshToken"),
                    })
                }
            ).then(
                resp => resp.json()
            ).catch(
                (e)=> console.log(e)
            );

            localStorage.setItem('accessToken', newAccessToken);

        }


        if( message === 'authorized' && ( window.location.href.includes( '/register' ) ) ){

            alert('logged in already');

            // send user back to main page
            window.location.href = '/'
            // return;
        }

        // display the page if user has access
        if( message === 'authorized' || message === 'unauthorized'  ){

            document.body.style.display = 'block';

        }

        // if the user does not have access, send them back to the login page
        if(
            message === 'restricted' &&
            ( window.location.href.includes( '/play' ) ) ){

            window.location.href = '/login';

        }
    }


    /* REFRESH TOKENS AFTER BECOMING INVALID */
    async refreshToken(){

        let message = await fetch(
            'http://localhost:5000/auth/refresh-token',
            {
                method : 'POST',
                body : JSON.stringify({
                    accessToken : localStorage.getItem('accessToken'),
                    refreshToken : localStorage.getItem('refreshToken'),
                })
            }

        ).then( resp => resp.json() )
            .catch( (e) => { console.log(e) } );

        alert('yos')
        if( message ){

        }

    }

}
