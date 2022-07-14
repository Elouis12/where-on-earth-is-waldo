
let waldoText = "Waldo Has Escaped! Find Him Again!";


/*
    BRING USER TO START SCREEN
*/
function start(){

    let answerDiv = document.getElementById("answer-container");
    let hintsContainer = document.getElementById("hints-container");
    let homeContainer = document.getElementById("home-container");

    homeContainer.style.display = "none";
    answerDiv.style.display = "flex";
    hintsContainer.style.display = "flex";

    getHint();
}


/*
    VALIDATES INPUT
*/
let toggle = false;

function answer(e){

    let hintsDiv = document.getElementById("hints-div");
    let hintsCount = document.getElementsByClassName("hints-p");

    let inputBox = e.parentElement.children[0];

    let remainingHintsCount = document.getElementById("remaining-hints-count");

    if( countriesArray && // countries has more countries to populate
        inputBox.value.toLowerCase().trim() === countriesArray[0].country.toLowerCase() && // user got it correct
        hintsCount.length > 0 ){ // if there are hints available

        hintsDiv.innerHTML = "";
        inputBox.value = "";

        // pop from countriesArray because they got it right
        countriesArray.shift();

        // clear hints array since we don't need those hints anymore

        // change name of get hint button
        setButtonTexts();

        // get new sets of hints for that country
        setHints();

        // reset hints count
        remainingHintsCount.innerText = 0;


    }else{

        // mak box shake when incorrect
        let answerText = document.getElementById("answer-text");

        // alert("wrong");
        answerText.classList.toggle("invalid", toggle);
    }

}

/*
    WHEN THE USER CLICKS ENTER
*/
function onEnter(e){

    // let textBox = document.getElementById("answer-text");

    if( e.keyCode === 13 ){
        alert(e.keyCode)
        e.preventDefault();
        answer();
    }
}


/*
    IF USER GETS STUCK THEY CAN CYCLE TO ANOTHER COUNTRY
    OR TO RESTART
*/

async function next(){


        setButtonTexts(); // sets appropriate text for it

        let country = countriesArray.shift(); // remove it from the front and returns it

        countriesArray.push(country); // push it to the back

        let hintsDiv = document.getElementById("hints-div");

        while (hintsDiv.children[0]) { // remove hints from div
            hintsDiv.removeChild(hintsDiv.children[0])
        }
        // hintsDiv.innerHTML = "";

        // await setHints(); // get the next country with its set of hints
        getHint();  // add the hints to the div

}

/*
     CHANGES TEXT OF BUTTONS
*/
function setButtonTexts(){


    let remainingHintsDiv = document.getElementById("remaining-hints-div");
    let locationTitleDiv = document.getElementById("location-title-h2");


    let getHintsButton = document.getElementById("show-hints").children[0];

    let nextButton = document.getElementById("next-button");

    if( !countriesArray || countriesArray.length === 0 ){ // no more countries left to populate

        getHintsButton.setAttribute("value", "You've Found Waldo in All Countries!");

        nextButton.setAttribute("value", "Restart");// puts restart for next button

    }else if( nextButton.getAttribute("value") === "Restart" ){ // user click restart, set get hints back

        nextButton.setAttribute("value", "Next");

    }else{

        getHintsButton.setAttribute("value", waldoText/*"Help Find Waldo... Again"*/)

    }

    remainingHintsDiv.classList.add("visibilityHidden"); // hide hint counter when user gets it right
    locationTitleDiv.classList.add("visibilityHidden"); // hide location title when user gets it right


}

/*
     SETS THE COUNTRIES FROM DB TO BE USED
*/
let countriesArray;
function setCountries(countriesData){

    countriesArray = countriesData; // now that its set
    randomize( countriesArray );
    setHints(); // grab the hints of the first country in the countries array

}

/*
     SETS THE HINTS FOR THE FIRST COUNTRY IN ARRAY
*/
let hintsArray;
async function setHints(){

    if( countriesArray && countriesArray.length > 0 ){

        await getGeoFacts( countriesArray[0].country ).then( (hints) => { hintsArray = hints }  );

    }
}


/*
     ADDS HINT TO LIST OF HINTS
*/
function getHint(){

    let remainingHintsCount = document.getElementById("remaining-hints-count");
    let remainingHintsDiv = document.getElementById("remaining-hints-div");
    let hintsDiv = document.getElementById("hints-div");
    let locationTitleDiv = document.getElementById("location-title-h2");

    // set hints left count
    remainingHintsCount.innerText = hintsArray.length > 0 ? hintsArray.length - 1 : 0;


    // change button back to 'get hint' if ext is 'find waldo... again'
    let getHintsButton = document.getElementById("show-hints").children[0];

    let currentButtonValue = getHintsButton.getAttribute("value"); // to use when verifying i we need to redisplay remaining hints


    if( getHintsButton.getAttribute("value").toLowerCase() === waldoText.toLowerCase() ){

        getHintsButton.setAttribute("value", "Get Hint");

    }

    // set new hint
    if( hintsArray && hintsArray.length > 0 &&
        countriesArray.length > 0 // there might be case where we come to the end and we didn't use up all hints but it may still display it
    ){ // set new hint

        hintsDiv.insertAdjacentHTML("beforeend", `<p class="hints-p">${hintsArray[0].fact}</p>`);// place a hint inside the hints div

        hintsArray.shift(); // remove the first most hint so when we call it again it the second hin will be first

    }



    // alert(currentButtonValue);
    // redisplay remaining hints div/count if hidden because input was correct
    if( currentButtonValue !== "Get Hint" && countriesArray.length > 0 ){

        remainingHintsDiv.classList.remove("visibilityHidden");
        locationTitleDiv.classList.remove("visibilityHidden");
    }

}

/*
    RANDOMIZE ARRAY SO EACH TIME USER GETS DIFFERENT COUNTRY WHEN ACCESSING SITE
*/
function randomize(arr) {
    var i, j, tmp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}
