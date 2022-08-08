import {GeoAPI} from './GeoAPI.js'

export class Game{

    #countriesQueue = [];
    #countriesTemp = []; // so we can restart
    #waldoText = "Waldo Has Escaped! Find Him Again!";
    #geoAPI  = new GeoAPI();
    #difficulty; // -3 is how many hints to show
    #gameMode;
    #extraGameMode;
    #countryCount = 0; // max country user can use


    timesWrong = 0; // find how many times the user clicked on the wrong country
    #found = 0; // number of times user found waldo

    constructor(){

        this.#initGame();

    }

/*
    INITIALIZE OUR FIELDS
*/
    async #initGame(){

        await this.#geoAPI.getAllCountries().then(

            ( countries ) => {

                this.#setCountries( countries ); // get all countries and hints
            }
        );

    }

/*
    BRING USER TO START SCREEN
*/
     start(){

        let hintsContainer = document.getElementById("hints-container");
        let navBarContainer = document.getElementById("navbar-container");
        let settingsSection = document.getElementById("settings-box");
        let startButton = document.getElementById("start-button");

         let listOfCountries = document.getElementsByClassName("select-country");


        // grab the options
        //  this.#setDifficulty();
         this.#setCountryCount();
         this.#setGameMode();
         this.#setExtraGameMode();

         this.#updateFoundCountDiv();


         const gameMode = this.#getGameMode();
         // const difficulty = this.#getDifficulty();
         const countryCount = this.getCountryCount();


         if(
             listOfCountries.length <= 0 &&
             ( isNaN(countryCount) || countryCount < 1 || countryCount > this.getCountries().length )
         ){

             let messageParagraph = document.getElementById("country-count-message");

             messageParagraph.innerText = `Count cannot be less than 1 or greater than ${ this.getCountries().length }`;
             return;
         }


         // hide get hints and remaining hint count if game mode is not hints
         if( gameMode !== "hints" ){

             const getHintsButton = document.getElementById("get-hint-button");
             const remainingDiv = document.getElementById("remaining-hints-div");

             getHintsButton.classList.add("hide");
             remainingDiv.classList.add("hide");
         }


         // USE USER SELECTED COUNTRIES
         if( listOfCountries.length > 0 ){

             this.#customCountryOptions();
         // USE SELECTED COUNT OF COUNTRIES
         }else{

             this.#countriesQueue = this.#countriesQueue.slice( 0, this.getCountryCount() ); // slice the array depending on how many countries the user wanted

         }

         // based on the game mode display the according text
         this.#displayTextAccordingToGameMode( gameMode );


         this.#updateCountriesRemaining(); // sets the remaining countries after slicing it

         this.updateAttemptsCountDiv();

         // remove next button if user only selected 1 country
         if( this.#countriesQueue.length === 1 ){

             document.getElementById("next-button").classList.add("visibilityHidden");
         }

        // remove attempts if only 1 country is left or user selected 1 country
         let attemptSpan = document.getElementById("attempt-span");
         if( this.getCountries().length === 1 ){

             // show attempts
             attemptSpan.classList.add("hide");

         }

         // display / hide the elements
         settingsSection.style.visibility = "hidden";
         startButton.style.visibility = "hidden";
         hintsContainer.style.display = "flex";
         navBarContainer.style.visibility = "hidden";



    }

/*  DISPLAYS APPROPRIATE TEXT ACCORDING TO GAME MODE  */
    #displayTextAccordingToGameMode(gameMode){

        let hintsDiv = document.getElementById("hints-div");

        if( this.#countriesQueue.length > 0 ){

            switch ( gameMode ){

                case "countries" :
                    hintsDiv.insertAdjacentHTML("beforeend", `<p class="hints-p">Waldo was last seen in <span class="capital-text">${this.#countriesQueue[0].country }</span></p>`);
                    break;

                case "capitals" :
                    hintsDiv.insertAdjacentHTML("beforeend", `<p class="hints-p">Sources tells us its capital is <span class="capital-text">${this.#countriesQueue[0].capital } </span></p>`);
                    break;

                case "flags" :
                    // hintsDiv.insertAdjacentHTML("beforeend", `<p >Waldo was spotted carrying this flag <br/><image height="100" style="width: 100%;" class="hints-p" alt="${this.#countriesQueue[0].country}" src="${this.#countriesQueue[0].flag_image}" /></p>`);


                    document.getElementById("hints-div").classList.remove("hints-div");
                    document.getElementById("hints-div").classList.add("structure-flag-emoji");

                    hintsDiv.insertAdjacentHTML("beforeend",
                        `
                                <span >Waldo was spotted carrying this flag</span> 
                                <span id="flag-emoji">${ this.#countriesQueue[0].flag_emoji }</span>
                            `

                    );
                    document.getElementById("hints-div").style.width = "unset";
                    // document.getElementById("hints-div").style.height = "170px";

                    break;

                case "hints":
                    this.getHint();
                    break;
            }

        }

    }

/*
    PLAYER GAME OPTIONS
*/
    #getDifficulty(){ return this.#difficulty; }

    #getGameMode(){ return this.#gameMode; }

    getExtraGameMode(){ return this.#extraGameMode; }

    getCountryCount(){ return this.#countryCount; }

    #setDifficulty(){

         const difficultySpan = document.getElementById("settings-difficulty");

         this.#difficulty = Number(  difficultySpan.innerText.split(" ")[2] ) - 3; // gets 1, 2, 3(easy, medium, hard)

    }

    #setGameMode(){

         const gameModeSpan = document.getElementById("settings-game-mode");

        this.#gameMode =  gameModeSpan.innerText.toLowerCase().split(" ")[0];

    }

    #setExtraGameMode(){

         const extraGameModeSpan = document.getElementById("settings-extra-game-mode");

        this.#extraGameMode =  extraGameModeSpan.innerText.toLowerCase().split(" ")[0];

    }

    #setCountryCount(){

         const countryCountTextBox = document.getElementById("country-count");

        this.#countryCount =  Number( countryCountTextBox.value );

    }

    #customCountryOptions(){

        let listOfCountries = document.getElementsByClassName("select-country");

        const set = new Set();

        for( let x = 0; x < listOfCountries.length; x+=1 ){

            set.add( listOfCountries[x].children[0].innerText );
        }

        for( let x = 0; x < this.getCountries().length; x+=1 ){

            if( !set.has( this.getCountries()[x].country ) ){

                this.getCountries()[x] = null;
            }
        }

        this.#countriesQueue = this.getCountries().filter( countries =>  countries !== null );

        // save it into temp
        this.#countriesTemp = this.getCountries().slice();

    }


    #resetAttempts(){

        this.timesWrong = 0;
    }
/*
    VALIDATES INPUT
*/
    answer(input){


        let hintsDiv = document.getElementById("hints-div");

        let remainingHintsCount = document.getElementById("remaining-hints-count");

        if(  this.#countriesQueue.length > 0 && // countries has more countries to populate
             input.toLowerCase().trim() === this.#countriesQueue[0].country.toLowerCase() // if there are hints available

            ){

            // user got it right before attempts reached 0
            if( this.timesWrong < 3 ){

                // update found count
                this.#found++;
            }

            this.#resetAttempts();
            this.updateAttemptsCountDiv();


            // empty the div
            hintsDiv.innerHTML = "";

            // reset hints count
            remainingHintsCount.innerText = 0;

            // pop from countriesQueue because they got it right
            this.#countriesQueue.shift();

            // set next round
            this.#setNextRound();

            return true;

        }

        return false;

    }


/*
     PREPARES THE ROUND AFTER USER GETS IT CORRECTLY
*/
    #setNextRound(){


        let nextRoundButton = document.getElementById("next-round-button");
        let remainingDiv = document.getElementById("remaining-div");
        let titleAndButtons = document.getElementById("title-buttons-div");

        let blinkText = document.getElementById("show-answer");
        let foundSpan = document.getElementById("found-span");
        let attemptSpan = document.getElementById("attempt-span");


        nextRoundButton.classList.remove("hide");

        // HIDE THE ELEMENTS EXCEPT GET HINT BUTTON
        remainingDiv.classList.add("hide"); // hide hint counter when user gets it right
        titleAndButtons.classList.add("visibilityHidden"); // hide location title when user gets it right

        blinkText.classList.add("hide");

        attemptSpan.classList.add("hide");

        // in case the user was shown "rotate the globe..." and the attempt span and found spans were hidden
        if( foundSpan.getAttribute("class") === "hide" ){
            foundSpan.classList.remove("hide"); // keep the total user found

        }
        // foundSpan.classList.add("hide");

        this.#updateFoundCountDiv();

        // USER GOT ALL COUNTRIES
        if( this.getCountries().length === 0 ){

            nextRoundButton.setAttribute("value", "You've Found Waldo in All Countries!");
            // foundSpan.classList.remove("hide"); // keep the total user found

        // USER GOT A COUNTRY
        }else{

            nextRoundButton.setAttribute("value", this.#waldoText);

        }




        // REMOVE NEXT BUTTON IF 1 MORE COUNTRY REMAINS
        if( this.#countriesQueue.length === 1 ) {

            document.getElementById("next-button").classList.add("visibilityHidden");
            document.getElementById("previous-button").classList.add("visibilityHidden");

        }

        if( this.#getGameMode() === 'hints' ){

            const getHintButton = document.getElementById("get-hint-button");
            getHintButton.classList.add("hide");
        }


    }


/*
     SETS THE COUNTRIES FROM DB TO BE USED
*/

    async #setCountries(countriesData){

        this.#countriesQueue = countriesData.slice(); // now that its set
        this.#countriesTemp = countriesData.slice(); // now that its set

        const setListToCountries = document.getElementById("country-options-ul");

        for( let x = 0; x < this.#countriesQueue.length; x+=1 ){

            // SET COUNTRIES TO LIST IN HTML
            setListToCountries.insertAdjacentHTML(
                "beforeend",
                `<li onclick="selectCountry(this)">
                        <span >${this.#countriesQueue[x].country}</span>
                        <i class="fa-solid fa-earth-europe"></i>
                     </li>`
            )
            // SET HINTS
            await this.#geoAPI.getGeoFacts( this.#countriesQueue[x].country, 3 /*- this.#difficulty*/ ).then( (facts)=>{

                let randomizedFacts = this.#randomize( facts ); // randomize the facts

                this.#countriesQueue[x]["facts"] = randomizedFacts; // add facts property to each object

            } );

            if( x+1 === this.#countriesQueue.length ){

                this.#randomize( this.#countriesQueue ); // randomize entire array

            }

        }

        console.log(this.getCountries());


    }


/*
    PREVIOUS COUNTRY
*/

    previous(){

        this.#hideBlinkingText();

        this.#resetAttempts();
        this.updateAttemptsCountDiv();


        let foundSpan = document.getElementById("found-span");
        let attemptSpan = document.getElementById("attempt-span");

        foundSpan.classList.remove("hide");

        attemptSpan.classList.remove("hide");

        let hintsDiv = document.getElementById("hints-div");
        hintsDiv.innerHTML = "";

        let country = this.getCountries()[ this.getCountries().length - 1 ] ; // get the last country

        this.getCountries().unshift( country ); // put it in the front
        this.getCountries().pop(); // remove it


        this.#displayTextAccordingToGameMode( this.#getGameMode() );


    }

    #hideBlinkingText(){

        let blinkingText = document.getElementById("show-answer");

        if( blinkingText.getAttribute("class") === "blink-text" ){

            blinkingText.classList.add("hide");
        }
    }

/*
    NEXT COUNTRY
*/

    next(){

        this.#hideBlinkingText();

        this.#resetAttempts();
        this.updateAttemptsCountDiv();


        let foundSpan = document.getElementById("found-span");
        let attemptSpan = document.getElementById("attempt-span");

        foundSpan.classList.remove("hide");

        attemptSpan.classList.remove("hide");


        const previousButton = document.getElementById("previous-button");

        if( this.#countriesQueue.length > 1 ){

            previousButton.classList.remove("visibilityHidden"); // show previous button

            let hintsDiv = document.getElementById("hints-div");
            hintsDiv.innerHTML = "";

            let country = this.getCountries().shift(); // get the first country

            this.getCountries().push( country ); // push it to the back

            this.#displayTextAccordingToGameMode( this.#getGameMode() );

        }

    }

/*
    RESTARTS THE GAME
*/
    #restart(){


        this.#found = 0;

        this.#updateFoundCountDiv();

        let hintsDiv = document.getElementById("hints-div");
        hintsDiv.innerHTML = "";

        this.#countriesQueue = this.#countriesTemp.slice();

        this.#randomize( this.#countriesQueue );

        let listOfCountries = document.getElementsByClassName("select-country");

        // IN THE EVENT THE USER DID NOT SELECT CUSTOM COUNTRIES AND GAVE A COUNT LIMIT
        if( listOfCountries.length <= 0 ){

            this.#countriesQueue = this.#countriesQueue.slice(0, this.getCountryCount());

        }

        // it will be hidden because when 1 remains next button is hidden
        document.getElementById("next-button").classList.remove("visibilityHidden");

        // remove next button if user only selected 1 country
        if( this.#countriesQueue.length === 1 ){

            document.getElementById("next-button").classList.add("visibilityHidden");
        }
    }

/*
     ADDS HINT TO LIST OF HINTS
*/
    getHint(){

        let hintsDiv = document.getElementById("hints-div");
        let remainingHintsCount = document.getElementById("remaining-hints-count");

        // SET HINTS LEFT COUNT
        remainingHintsCount.innerHTML =
            hintsDiv.children.length === this.#countriesQueue[0].facts.length ? // hints div is filled up with the facts
                0 // put 0
                :
                ( this.#countriesQueue[0].facts.length - hintsDiv.children.length ) - 1 ; // -1 because we put 1 hint into the div already


        remainingHintsCount.style.color ='white';


        // set new hint
        if( this.#countriesQueue.length > 0  &&
            hintsDiv.children.length < this.#countriesQueue[0].facts.length ){

            hintsDiv.insertAdjacentHTML("beforeend", `<p class="hints-p">${this.#countriesQueue[0].facts[ hintsDiv.children.length ]/*.fact*/ }</p>`);// place a hint inside the hints div

        }

    }


    #getNextRound(){

        // RESTART THE GAME IF ALL COUNTRIES HAVE BEEN USED
        if( this.#countriesQueue.length <= 0 ){

            this.#restart();
        }


        let nextRoundButton = document.getElementById("next-round-button");
        let remainingDiv = document.getElementById("remaining-div");
        let titleAndButtons = document.getElementById("title-buttons-div");
        let previousButton = document.getElementById("previous-button");

        let foundSpan = document.getElementById("found-span");
        let attemptSpan = document.getElementById("attempt-span");


        if( this.getCountries().length === 1 ){

            // show attempts
            attemptSpan.classList.add("hide");

        }

        foundSpan.classList.remove("hide");
        attemptSpan.classList.remove("hide");



        remainingDiv.classList.remove("hide"); // hide hint counter when user gets it right
        titleAndButtons.classList.remove("visibilityHidden"); // hide location title when user gets it right
        nextRoundButton.classList.add("hide");
        previousButton.classList.add("visibilityHidden");


        // add hints button if game mode is hints
        if( this.#getGameMode() === 'hints' ){

            const getHintButton = document.getElementById("get-hint-button");
            getHintButton.classList.remove("hide");
        }

        // SET COUNTRIES LEFT COUNT
        this.#updateCountriesRemaining();

        // display the next thing to the div
        this.#displayTextAccordingToGameMode( this.#getGameMode() );


    }

    startNextRound(){

        this.#getNextRound();
    }

/*  COUNTRIES REMAINING */
    #updateCountriesRemaining(){

        let remainingCountriesCount = document.getElementById("remaining-countries-count");

        remainingCountriesCount.style.color ='white';

        // SET COUNTRIES LEFT COUNT
        remainingCountriesCount.innerHTML =
            this.getCountries().length <= 0 ? // hints div is filled up with the facts
                0 // put 0
                :
                this.getCountries().length - 1 ; // -1 because we're always at one country

    }

    updateAttemptsCountDiv(){

        let attemptSpan = document.getElementById("attempt-count");

        attemptSpan.innerText = 3 - this.timesWrong;
    }

    #updateFoundCountDiv(){

        let foundCountSpan = document.getElementById("found-count");
        let listOfCountries = document.getElementsByClassName("select-country");


        let countriesTotal = listOfCountries.length > 0 ? listOfCountries.length : this.getCountryCount();

        foundCountSpan.innerText = `${ this.#found } / ${ countriesTotal }`
    }

    getCountries(){

        return this.#countriesQueue;
    }


/*
    RANDOMIZE ARRAY SO EACH TIME USER GETS DIFFERENT COUNTRY WHEN ACCESSING SITE
*/
    #randomize(arr) {
        var i, j, tmp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }

}







