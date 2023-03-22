export class UserAuthAPI{


    _username;

    _email;

    _password;

    _passwordConfirmation;

    logoutUser(){

        localStorage.setItem('accessToken', '');
        localStorage.setItem('refreshToken', '');

        window.location.href = '/login';
    }


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
            '/auth/register',
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
                inputs[0].children[ 2 ].children[1].innerText = message.issues.username;

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
            '/auth/login',
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

        let emailError = document.getElementById("email-error");

        if( message.success ){

            // set the tokens
            localStorage.setItem('accessToken', message.accessToken)
            localStorage.setItem('refreshToken', message.refreshToken)
            window.location.href = '/'

            emailError.style.visibility = 'hidden';

        }else {


            // issues with credentials
            if ( message.issue ) {

                // email or username
                inputs[0].children[0].children[0].style.color = '#ff4c4c';
                inputs[0].children[2].children[0].classList.remove('hideVisibility');
                inputs[0].children[2].children[1].innerText = message.issue;

                // password
                inputs[1].children[0].children[0].style.color = '#ff4c4c';
                inputs[1].children[2].children[0].classList.remove('hideVisibility');
                inputs[1].children[2].children[1].innerText = message.issue;

                emailError.style.visibility = 'hidden';


                // issue with email verification
            } else if( message.error ){

                // email or username
                inputs[0].children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[0].children[2].children[0].classList.add('hideVisibility');

                // password
                inputs[1].children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[1].children[2].children[0].classList.add('hideVisibility');

                emailError.style.visibility = 'visible';

            }else {

                // email or username
                inputs[0].children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[0].children[2].children[0].classList.add('hideVisibility');

                // password
                inputs[1].children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
                inputs[1].children[2].children[0].classList.add('hideVisibility');

                emailError.style.visibility = 'hidden';

            }

        }

    }



    /* GET USER INFO TO POPULATE GRAPHS AND CHARTS */
    async userInfo(){

        let message = await fetch(
            '/auth/user-info',
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


    async updateUserInfo(username, email, currentPassword, newPassword){

        let message = await fetch(
            '/auth/update-user-info',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    username : username,
                    email : email,
                    currentPassword : currentPassword,
                    newPassword : newPassword,
                    refreshToken : localStorage.getItem("refreshToken"),
                })
            }

        ).then( resp => resp.json() )
            .catch( (e) => { console.log(e) } );

        return message;

    }

    async deleteAccount(){

        let message = await fetch(

            '/auth/delete-account',
            {
                method : 'POST',
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    refreshToken : localStorage.getItem("refreshToken"),
                })
            }

        ).then( resp => resp.json() )
            .catch( (e) => { console.log(e) } );

        return message;

    }


    // for when resetting password from email
    async verifyResetToken(){

        let resetToken = window.location.href.split('=')[1];

        // verify reset token
        let message = await fetch(

            "/auth/verify-token",
            {
                method: 'POST',
                headers : {

                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({
                    resetToken: resetToken
                })
            }
        ).then(
            resp => resp.json()
        ).catch(
            (e)=> console.log(e)
        );

        if( message === 'restricted' ){

            document.getElementById('header-title').innerText = "Request Expired"
            let inputContainer = document.getElementById('input-container');

            // hide everything except go home button
            for( let x = 0; x < inputContainer.children.length; x++  ){

                if( inputContainer.children[x].getAttribute('id') !== 'invalid-request-button'  ){

                    inputContainer.children[x].classList.add('hide')

                // show the go home button
                }else{

                    inputContainer.children[x].classList.remove('hide')

                }
            }

            return false;
        }

        document.body.classList.remove('hide');

        return true;

    }

    // where user create password get these implementations from ForgotPassword.js
    async createPassword(){


    }

    async verifyToken(){

        // verify access token
        let message = await fetch(

            "/auth/verify-token",
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

        // make call to refresh the token
        if( message === 'unauthorized' ){

            let newAccessToken = await fetch(

                "/auth/refresh-token",
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




        // user is logged in and tries to access certain pages
        if( message === 'authorized' &&
            (
                window.location.href.includes( '/register' )
                ||
                window.location.href.includes( '/login' )
                ||
                window.location.href.includes( '/reset-password' )

            )
        ){

            // send user back to main page
            window.location.href = '/'
            return;
        }

        // display the page if user has access
        if( message === 'authorized' ){

            // document.body.style.display = 'block';
            document.body.children[0].style.display = 'block';

        }

        // if the user does not have access, send them back to the login page
        if(
            message === 'restricted' &&
            (
                window.location.href.includes( '/stats' ) ||
                window.location.href.includes( '/settings' )
            )
        ){

            window.location.href = '/login';

        }else{

            document.body.children[0].style.display = 'block';

        }
    }


    /* REFRESH TOKENS AFTER BECOMING INVALID */
    async refreshToken(){

        let message = await fetch(
            '/auth/refresh-token',
            {
                method : 'POST',
                body : JSON.stringify({
                    accessToken : localStorage.getItem('accessToken'),
                    refreshToken : localStorage.getItem('refreshToken'),
                })
            }

        ).then( resp => resp.json() )
            .catch( (e) => { console.log(e) } );

        if( message ){

        }

    }

}

