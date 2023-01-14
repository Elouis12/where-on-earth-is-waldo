import {UserAuthAPI} from "./userAuthAPI.js"



class RegisterUser{

    #userAuthApi
    #signUpButton;
    #body;


    constructor() {


        this.#userAuthApi = new UserAuthAPI();

        this.#signUpButton = document.getElementById('signup-button');

        this.#body = document.body;

        this.#signUpButton.addEventListener('click', this.#userAuthApi.registerUser.bind() );

    }

}





function main(){

    // adds functions to the register button
    let registerUser = new RegisterUser();
}


main();
