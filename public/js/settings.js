
function changeText(e){

    let value = e.children[0].innerHTML;
    let fullValue = e.innerHTML;
    let textDiv = e.parentElement.parentElement.children[0].children[1];

    textDiv.innerHTML = fullValue;

    const difficulty = document.getElementById("difficulty-ul");
    const gameMode = document.getElementById("settings-game-mode").children[0].innerText;

    // UNCOMMENT FOR WHEN PUTTING BACK EXTRA GAME MODE

    // put strikethrough on difficulty if user clicked game mode other than hints
  /*  if(
        (
            e.parentElement.getAttribute("id") === "game-modes-ul" &&
            value !== "Hints"
        ) // user clicked a game mode besides hints
            ||
        (
            e.parentElement.getAttribute("id") === "difficulty-ul" &&
            gameMode !== "Hints"
        ) // user clicks a difficulty while a mode is not hints
    ){

        // strike through the current difficulty
        document.getElementById("settings-difficulty").style.textDecoration = "line-through";

        // strike through all difficulty options
        for( let x = 0; x < difficulty.children.length; x+=1 ){
            difficulty.children[x].style.textDecoration = "line-through";

        }

    }else if( value === "Hints" ){

        document.getElementById("settings-difficulty").style.textDecoration = "none";

        for( let x = 0; x < difficulty.children.length; x+=1 ){
            difficulty.children[x].style.textDecoration = "none";

        }
    }
*/
}


function selectCountry(e){

    // if it's already select remove it
    if( e.getAttribute("class") === "select-country" ){

        e.classList.remove("select-country");
        // e.children[0].classList.remove("country-selected"); // remove country-selected class to it so we make sure we grab all the ones the user wanted

    }else{

        e.classList.add("select-country");
        // e.children[0].classList.add("country-selected"); // add country-selected class to the span so we can grab all the ones clicked on

    }


    disableCountryCountBox();

}

function disableCountryCountBox(){

    // if any country is selected
    // disabled country count box

    const listOfCountries = document.getElementsByClassName("select-country");
    const countryInputBox = document.getElementById("country-count");

    if( listOfCountries.length > 0 ){

        countryInputBox.disabled = true;
        countryInputBox.style.cursor = "not-allowed"
        countryInputBox.style.opacity = "0.2";

    }else{

        countryInputBox.disabled = false;
        countryInputBox.style.cursor = "text"
        countryInputBox.style.opacity = "1";

    }
}
function selectAllCountries(){

    const listOfCountries = document.getElementById("country-options-ul").children;

    const checkbox = document.getElementById("pill3");

    const countryInputBox = document.getElementById("country-count");


    // highlight / de-select all
    // first 2 element will be the option to select / de-select all AND the search
    for (let x = 2; x < listOfCountries.length; x+=1 ){

        // user wants to select all countries
        if( checkbox.checked ){

            // no need to select it if it's already selected
            if( listOfCountries[x].getAttribute("class") !== "select-country" ){


                listOfCountries[x].classList.add("select-country");

            }

        }else{

            // no need to de-select it if it's already not selected
            if( listOfCountries[x].getAttribute("class") === "select-country" ){

                listOfCountries[x].classList.remove("select-country");

            }
        }

    }

    disableCountryCountBox();
}

function search(element){

    const value = element.value.toLowerCase();

    let listOfCountriesSpan = document.getElementsByClassName("country");

    let doesContain;

    let didContain = false;

    for( let x = 0; x < listOfCountriesSpan.length; x+=1 ){

        doesContain = listOfCountriesSpan[x].innerHTML.toLowerCase().includes(value);

        listOfCountriesSpan[x].parentElement.classList.toggle("hide", !doesContain ); // hide the ones that it does not contain

        if( doesContain ){

            didContain = true;
        }
    }


    if( !didContain ){ // none contained it then show all of the words again


        for( let x = 0; x < listOfCountriesSpan.length; x+=1 ){

            listOfCountriesSpan[x].parentElement.classList.remove("hide"/*, !doesContain*/ ); // hide the ones that it does not contain

        }

    }

}