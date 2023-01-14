import {UserAuthAPI} from "./userAuthAPI.js"

class LoginUser{

    #userAuthApi
    #loginButton;
    #body;


    constructor() {


        this.#userAuthApi = new UserAuthAPI();

        this.#loginButton = document.getElementById('login-button');

        this.#body = document.body;

        this.#loginButton.addEventListener('click', this.#userAuthApi.loginUser.bind() );

    }

}





function main(){

    // adds functions to the register button
    let loginUser = new LoginUser();
}


main();
