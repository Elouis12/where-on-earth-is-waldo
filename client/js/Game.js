import {GeoAPI} from './GeoAPI.js'

export class Game{

    #countriesArrayQueue = [];
    #countriesArrayTemp = []; // so we can restart
    #hintsArray = [];
    #waldoText = "Waldo Has Escaped! Find Him Again!";
    #geoAPI  = new GeoAPI();



    constructor(){

        this.#init();
    }

/*
    INITIALIZE OUR FIELDS
*/
    async #init(){

        await this.#geoAPI.getAllCountries().then(

            ( countries ) => {

                this.#setCountries( countries );
            }
        ); // get all countries

        await this.#setHints(); // grab the hints of the first country in the countries array

        this.getHint(); // displays the first link
    }

/*
    BRING USER TO START SCREEN
*/
     start(){

        // let answerDiv = document.getElementById("answer-container");
        let hintsContainer = document.getElementById("hints-container");
        let navBarContainer = document.getElementById("navbar-container");
        let introDiv = document.getElementById("intro-div");

        // answerDiv.style.display = "flex";
        hintsContainer.style.display = "flex";

        navBarContainer.style.visibility = "hidden";
        introDiv.style.visibility = "hidden";

    }


/*
    VALIDATES INPUT
*/
    answer(input){

        let hintsDiv = document.getElementById("hints-div");
        let hintsCount = document.getElementsByClassName("hints-p");

        // let inputBox =document.getElementById("answer-text");

        let remainingHintsCount = document.getElementById("remaining-hints-count");

        if(  this.#countriesArrayQueue.length > 0 && // countries has more countries to populate
             input.toLowerCase().trim() === this.#countriesArrayQueue[0].country.toLowerCase() && // user got it correct
             hintsCount.length > 0 ){ // if there are hints available

            // alert("correct");
            hintsDiv.innerHTML = "";
            // inputBox.value = "";

            // pop from countriesArrayQueue because they got it right
            let country = this.#countriesArrayQueue[0];
            this.#countriesArrayQueue.shift();

            // store used country in temp array
            this.#countriesArrayTemp.push( country );

            // change name of get hint button
            this.#setButtonTexts();

            // get new sets of hints for that country
            this.#setHints();

            // reset hints count
            remainingHintsCount.innerText = 0;

        }

        if( this.#countriesArrayQueue.length <= 0 ){ // if after answering the countries queue become empty set up the array again


            this.#restart();
        }

    }


/*
     CHANGES TEXT OF GET HINT BUTTON
*/
    #setButtonTexts(){


        let remainingHintsDiv = document.getElementById("remaining-hints-div");
        let locationTitleDiv = document.getElementById("location-title-h2");


        let getHintsButton = document.getElementById("show-hints").children[0];


        if( this.#countriesArrayQueue.length === 0 ){ // no more countries left to populate

            getHintsButton.setAttribute("value", "You've Found Waldo in All Countries!")

        }else{

            getHintsButton.setAttribute("value", this.#waldoText );

        }

        remainingHintsDiv.classList.add("visibilityHidden"); // hide hint counter when user gets it right
        locationTitleDiv.classList.add("visibilityHidden"); // hide location title when user gets it right


    }

/*
     SETS THE COUNTRIES FROM DB TO BE USED
*/

    #setCountries(countriesData){

        this.#countriesArrayQueue = countriesData; // now that its set
        console.log(this.#countriesArrayQueue)
        this.#randomize( this.#countriesArrayQueue );

    }

/*
     SETS THE HINTS FOR THE FIRST COUNTRY IN ARRAY
*/
    async #setHints(){

        if( this.#countriesArrayQueue.length > 0 ){

            await this.#geoAPI.getGeoFacts( this.#countriesArrayQueue[0].country ).then( (hints) => { this.#hintsArray = hints }  );

        }
    }

/*
    NEXT COUNTRY
*/

    async next(){

        if( this.#countriesArrayQueue.length > 1 ){

            let hintsDiv = document.getElementById("hints-div");
            hintsDiv.innerHTML = "";

            let country = this.#countriesArrayQueue.shift(); // get the first country

            this.#countriesArrayQueue.push( country ); // push it to the back

            await this.#setHints(); // set a new set of hints

            await this.getHint(); // get a new set of hints
        }

    }

/*
    RESTARTS THE GAME
*/
    async #restart(){

        this.#hintsArray = [];

        let hintsDiv = document.getElementById("hints-div");
        hintsDiv.innerHTML = "";

        this.#countriesArrayTemp.forEach( ( country )=>{

            this.#countriesArrayQueue.push( country );
        } );

        this.#countriesArrayTemp = []; // make it empty again

        this.#randomize( this.#countriesArrayQueue );

        await this.#setHints(); // set a new set of hints

    }

/*
     ADDS HINT TO LIST OF HINTS
*/
    async getHint(){

        let remainingHintsCount = document.getElementById("remaining-hints-count");
        let remainingHintsDiv = document.getElementById("remaining-hints-div");
        let hintsDiv = document.getElementById("hints-div");
        let locationTitleDiv = document.getElementById("location-title-h2");

        // set hints left count
        remainingHintsCount.innerText = this.#hintsArray.length > 0 ? this.#hintsArray.length - 1 : 0;


        // change button back to 'get hint' if ext is 'find waldo... again'
        let getHintsButton = document.getElementById("show-hints").children[0];

        let currentButtonValue = getHintsButton.getAttribute("value"); // to use when verifying i we need to redisplay remaining hints


        if( getHintsButton.getAttribute("value").toLowerCase() === this.#waldoText.toLowerCase() || // ready to start new hint / game
            this.#countriesArrayTemp.length <= 0 // when Temp is empty that means we have restarted
        ){

            getHintsButton.setAttribute("value", "Get Hint");

        }


        // set new hint
        if( this.#hintsArray && this.#hintsArray.length > 0  ){

            hintsDiv.insertAdjacentHTML("beforeend", `<p class="hints-p">${this.#hintsArray[0].fact}</p>`);// place a hint inside the hints div

            this.#hintsArray.shift(); // remove the first most hint so when we call it again it the second hin will be first

        }

        // redisplay remaining hints div/count if hidden because input was correct
        if( currentButtonValue !== "Get Hint" && this.#countriesArrayQueue.length > 0 ){

            remainingHintsDiv.classList.remove("visibilityHidden");
            locationTitleDiv.classList.remove("visibilityHidden");
        }

    }



    getCountries(){

        return this.#countriesArrayQueue;
    }


    getHints(){

        return this.#hintsArray;
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







