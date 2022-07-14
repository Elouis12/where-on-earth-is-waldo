
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
        setGetHintText();

        // get new sets of hints for that country
        // setHints();
        // getHint();
        hintsArray[0].shift(); // go to new hints

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
*/

async function next(){

    let country = countriesArray.shift(); // remove it from the front and returns it

    countriesArray.push(country); // push it to the back

    let hintOfCountry = hintsArray[0].shift();
    console.log(hintOfCountry)
    console.log(hintsArray[0][0])
    console.log(hintsArray[0][0].fact)

    hintsArray.push(hintOfCountry);

    let hintsDiv = document.getElementById("hints-div");

    while (hintsDiv.children[0] ) {
        hintsDiv.removeChild( hintsDiv.children[0] )
    }
    // hintsDiv.innerHTML = "";

    // await setHints(); // get the next country with its set of hints
    getHint();  // add the hints to the div
}

/*
     CHANGES TEXT OF GET HINT BUTTON
*/
function setGetHintText(){


    let remainingHintsDiv = document.getElementById("remaining-hints-div");
    let locationTitleDiv = document.getElementById("location-title-h2");


    let getHintsButton = document.getElementById("show-hints").children[0];


    if( !countriesArray || countriesArray.length === 0 ){ // no more countries left to populate

        getHintsButton.setAttribute("value", "You've Found Waldo in All Countries!")

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
    console.log(countriesArray)
    randomize( countriesArray );
    setHints(); // grab the hints of the first country in the countries array

}

/*
     SETS THE HINTS FOR THE FIRST COUNTRY IN ARRAY
*/
let hintsArray = [];
async function setHints(){

    if( countriesArray && countriesArray.length > 0 ){

        // await getGeoFacts( countriesArray[0].country ).then( (hints) => { hintsArray = hints }  );


        countriesArray.forEach( async (x)=>{

            await getGeoFacts( x.country ).then( (hints) => { hintsArray.push(hints); }  );

        } );
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
    remainingHintsCount.innerText = hintsArray.length > 0 ? hintsArray[0].length - 1 : 0;


    // change button back to 'get hint' if ext is 'find waldo... again'
    let getHintsButton = document.getElementById("show-hints").children[0];

    let currentButtonValue = getHintsButton.getAttribute("value"); // to use when verifying i we need to redisplay remaining hints


    if( getHintsButton.getAttribute("value").toLowerCase() === waldoText.toLowerCase() ){

        getHintsButton.setAttribute("value", "Get Hint");

    }

    // set new hint
    if( hintsArray && Object.keys(hintsArray[0]).length > 0  ){

        hintsDiv.insertAdjacentHTML("beforeend", `<p class="hints-p">${hintsArray[0][0].fact}</p>`);// place a hint inside the hints div

        hintsArray[0].shift(); // remove the first most hint so when we call it again it the second hin will be first

    }


    // alert(currentButtonValue);
    // redisplay remaining hints div/count if hidden because input was correct
    if( currentButtonValue !== "Get Hint" && countriesArray.length > 0 ){

        remainingHintsDiv.classList.remove("visibilityHidden");
        locationTitleDiv.classList.remove("visibilityHidden");
    }

}

/*

*/
function restart(){

    if( countriesArray.length <= 0 ){

        let nextButton = document.getElementById("next-button");

        nextButton.setAttribute("value", "Restart");
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
