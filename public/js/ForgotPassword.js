/* PUT FUNCTIONS IN USER AUTH API AND SET UP LIKE LOGIN.JS WITH CLASS */

// import {UserAuthAPI} from "./userAuthAPI.js";

async function resetPassword(){

    // post request to send email

    let email = document.getElementById("email");

    let message = await fetch(
        'http://localhost:5000/auth/reset-password',
        {
            headers: { // this made us not get an empty object
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
                email : email.value
            })
        }
    ).then( resp => resp.json() )
        .catch( (e)=>{ console.log(e) } )


    if( message === 'restricted' ){

        // reset/remove icon and messages
        email.parentElement.children[0].children[0].style.color = '#c1c1c1';
        email.parentElement.children[2].children[0].classList.add('hideVisibility');
        document.getElementById('reset-sent-text').classList.add('hide');


        // tell user to check email
        document.getElementById('reset-sent-text').classList.remove('hide');
        document.getElementById("password-reset-text").classList.add('hide')

    }else if( message.issues ){

        if( message.issues.email ){

            // tell user to enter valid email format
            email.parentElement.children[0].children[0].style.color = '#ff4c4c'
            email.parentElement.children[2].children[0].classList.remove('hideVisibility');
            email.parentElement.children[2].children[1].innerText = message.issues.email;

            // hide messages
            document.getElementById('reset-sent-text').classList.add('hide');
            document.getElementById("password-reset-text").classList.add('hide')

        }


    // successfully sent message (or email does not exists to send one)
    }else{

        email.parentElement.children[0].children[0].style.color = '#c1c1c1';
        email.parentElement.children[2].children[0].classList.add('hideVisibility');
        document.getElementById('reset-sent-text').classList.add('hide');

        email.value = '';

        // show reset text
        document.getElementById("password-reset-text").classList.remove('hide')

    }

}

async function createPassword(){

    // post request to updates the users password
    let resetToken = window.location.href.split('=')[1];
    let password = document.getElementById("reset-password");
    let passwordConfirmation = document.getElementById("reset-password-confirmation");

    let message = await fetch(
        'http://localhost:5000/auth/create-password',
        {
            headers: { // this made us not get an empty object
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({

                resetToken : resetToken,
                password : password.value,
                passwordConfirmation : passwordConfirmation.value
            })
        }
    ).then( resp => resp.json() )
        .catch( (e)=>{ console.log(e) } )


    // if token is not valid
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

    // there's issues with password inputs
    }else if( message.issues ){

        if( message.issues.password ){

            // tell user to enter valid email format
            password.parentElement.children[0].children[0].style.color = '#ff4c4c';
            password.parentElement.children[2].children[0].classList.remove('hideVisibility');
            password.parentElement.children[2].children[1].innerText = message.issues.password;

        }

        if( message.issues.passwordConfirmation ){

            // tell user to enter valid email format
            passwordConfirmation.parentElement.children[0].children[0].style.color = '#ff4c4c';
            passwordConfirmation.parentElement.children[2].children[0].classList.remove('hideVisibility');
            passwordConfirmation.parentElement.children[2].children[1].innerText = message.issues.passwordConfirmation;

        }

        return;


    }else{

        password.parentElement.children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
        password.parentElement.children[2].children[0].classList.add('hideVisibility');

        passwordConfirmation.parentElement.children[0].children[0].style.color = 'hsl(142, 90%, 61%)';
        passwordConfirmation.parentElement.children[2].children[0].classList.add('hideVisibility');

    }
    // show rest text
    document.getElementById("password-reset-text").classList.remove('hideVisibility')
}


document.getElementById("reset-password-button")?.addEventListener('click', async ()=>{

    await resetPassword();
})


document.getElementById("create-password-button")?.addEventListener('click', async ()=>{

    await createPassword();
})