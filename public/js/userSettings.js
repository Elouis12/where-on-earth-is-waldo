import {UserAuthAPI} from "./userAuthAPI.js";

let userAuthAPI = new UserAuthAPI();

let usernameText = document.getElementById('username-text');
let usernameInput = document.getElementById('username-input');
let emailInput = document.getElementById('email-input');
let currentPasswordInput = document.getElementById('current-password-input');
let newPasswordInput = document.getElementById('new-password-input');

let editIcons = document.getElementsByClassName('icon-container');
let accountInputs = document.getElementsByClassName('account-input');
let updateAndCancelButton = document.getElementById("update-cancel-buttons")

let cancelButton = document.getElementById("cancel-btn");
let updateButton = document.getElementById("update-btn");

let modalContainer = document.getElementById("delete-modal-container");
let exitModal = document.getElementById("exit-modal");
let deleteButton = document.getElementById("delete-account-btn");
let keepAccountButton = document.getElementById("keep-account-btn");
let confirmDeleteButton = document.getElementById("confirm-delete-account-btn");


async function addSettingsInformation(){

    let message = await userAuthAPI.userInfo();

    usernameText.innerText = message[0].user_name;
    usernameInput.value = message[0].user_name;
    emailInput.value = message[0].email;
}

addSettingsInformation();

for( let x = 0; x < editIcons.length; x++ ){

    // edit icons
    editIcons[x].addEventListener("click", (e)=>{

        if( e.target.closest('.input-container-items').children[1].disabled ){

            e.currentTarget.children[0].style.color = 'hsl(142, 90%, 61%)';
            e.target.closest('.input-container-items').children[1].disabled = false;
            e.target.closest('.input-container-items').children[1].style.cursor = "text";

        }else{

            e.currentTarget.children[0].style.color = '#c1c1c1';
            e.target.closest('.input-container-items').children[1].disabled = true;
            e.target.closest('.input-container-items').children[1].style.cursor = "not-allowed";

        }

        // if user clicks div
        if( e.currentTarget.classList.contains("fa-pencil") ){

            e.currentTarget.style.color = 'hsl(142, 90%, 61%)';

            // if user click pencil
        }else{

            e.currentTarget.style.color = 'hsl(142, 90%, 61%)';

        }

    });

    // input boxes
    accountInputs[x].addEventListener('keyup', ()=>{

        updateAndCancelButton.classList.remove('hide');

    })


}


cancelButton.addEventListener('click', async ()=>{

    // disabled the input boxes
    for( let x = 0; x < accountInputs.length; x++ ){

        accountInputs[x].parentElement.children[2].children[0].style.color = '#c1c1c1';
        accountInputs[x].disabled = true;
        accountInputs[x].style.cursor = "not-allowed";

        // editIcons[x].click();
    }

    // update icons
    await addSettingsInformation();

    // hide buttons
    updateAndCancelButton.classList.add('hide');

    // remove any error messages
    document.getElementById('username-issue-container').children[0].classList.add('hideVisibility')
    document.getElementById('email-issue-container').children[0].classList.add('hideVisibility')
    document.getElementById('current-password-issue-container').children[0].classList.add('hideVisibility')
    document.getElementById('new-password-issue-container').children[0].classList.add('hideVisibility')

})


updateButton.addEventListener('click', async (e)=>{

    let usernameValue = usernameInput.value;
    let emailValue = emailInput.value;
    let currentPasswordValue = currentPasswordInput.value;
    let newPasswordValue = newPasswordInput.value;


    // empty means not to be updated so set to false
    if( usernameInput.disabled ){ usernameValue = false; }
    if( emailInput.disabled ){ emailValue = false; }
    if( currentPasswordInput.disabled ){ currentPasswordValue = false; }
    if( newPasswordInput.disabled ){ newPasswordValue = false; }

    let message = await userAuthAPI.updateUserInfo(
        usernameValue,
        emailValue,
        currentPasswordValue,
        newPasswordValue
    );


    if( message.issues ){

        if( message.issues.username ){

            document.getElementById('username-issue-container').children[0].classList.remove('hideVisibility')
            document.getElementById('username-message').innerText = message.issues.username;

        }else{

            document.getElementById('username-issue-container').children[0].classList.add('hideVisibility')
        }

        if( message.issues.email ){

            document.getElementById('email-issue-container').children[0].classList.remove('hideVisibility')
            document.getElementById('email-message').innerText = message.issues.email;

        }else{

            document.getElementById('email-issue-container').children[0].classList.add('hideVisibility')

        }

        if( message.issues.currentPassword ){

            document.getElementById('current-password-issue-container').children[0].classList.remove('hideVisibility')
            document.getElementById('current-password-message').innerText = message.issues.currentPassword;

        }else{

            document.getElementById('current-password-issue-container').children[0].classList.add('hideVisibility')

        }

        if( message.issues.newPassword ){

            document.getElementById('new-password-issue-container').children[0].classList.remove('hideVisibility')
            document.getElementById('new-password-message').innerText = message.issues.newPassword;

        }else{

            document.getElementById('new-password-issue-container').children[0].classList.add('hideVisibility')

        }

    }else{

        // remove any error messages
        document.getElementById('username-issue-container').children[0].classList.add('hideVisibility')
        document.getElementById('email-issue-container').children[0].classList.add('hideVisibility')
        document.getElementById('current-password-issue-container').children[0].classList.add('hideVisibility')
        document.getElementById('new-password-issue-container').children[0].classList.add('hideVisibility')


        // set new user's info
        usernameInput.setAttribute('placeholder', message.userInfo[0].user_name )
        emailInput.setAttribute('placeholder', message.userInfo[0].email )
        usernameText.innerText = message.userInfo[0].user_name;

        // set token
        localStorage.setItem('refreshToken', message.newRefreshToken);

        // disabled the input boxes
        for( let x = 0; x < accountInputs.length; x++ ){

            accountInputs[x].parentElement.children[2].children[0].style.color = '#c1c1c1';
            accountInputs[x].disabled = true;
            accountInputs[x].style.cursor = "not-allowed";

            // editIcons[x].click();
        }

        // hide update and cancel div
        updateAndCancelButton.classList.add('hide');

    }

})


deleteButton.addEventListener('click', ()=>{

    modalContainer.classList.remove('hide');

})

keepAccountButton.addEventListener('click', ()=>{

    modalContainer.classList.add('hide');

})
exitModal.addEventListener('click', ()=>{

    modalContainer.classList.add('hide');

})

modalContainer.addEventListener('click', ()=>{

    modalContainer.classList.add('hide');

})

confirmDeleteButton.addEventListener('click', async ()=>{


    await userAuthAPI.deleteAccount();

    // remove the token
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');

    // send the user to the register page
    window.location.href = '/register'
})


document.getElementById('logout-btn').addEventListener('click', userAuthAPI.logoutUser.bind() )
