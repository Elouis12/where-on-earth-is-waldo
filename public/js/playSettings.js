
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

    highlightSelection(e);
}


function highlightSelection(currentElement){

    const gameModeUl = document.getElementById("game-modes-ul").children;
    const extraGameModeUl = document.getElementById("extra-game-modes-ul").children;


// FOR GAME MODES SELECTED

    if( currentElement.parentElement.getAttribute("id") === "game-modes-ul" ){

        currentElement.classList.add("selected-mode");

        // remove all the others selected
        for( let x = 0; x < gameModeUl.length; x+=1  ){

            if( gameModeUl[x] !== currentElement && // is not the one we just selected
                gameModeUl[x].getAttribute("class") === "selected-mode" // has a highlight on it
            ){

                gameModeUl[x].classList.remove("selected-mode");

            }
        }
    }

// FOR EXTRA MODES SELECTED


    if( currentElement.parentElement.getAttribute("id") === "extra-game-modes-ul" ){

        currentElement.classList.add("selected-mode");

        // remove all the others selected
        for( let x = 0; x < extraGameModeUl.length; x+=1  ){

            if( extraGameModeUl[x] !== currentElement && // is not th one we just selected
                extraGameModeUl[x].getAttribute("class") === "selected-mode" // has a highlight on it
            ){

                extraGameModeUl[x].classList.remove("selected-mode");

            }
        }
    }

}

function selectCountry(e){

    // FOR THE COUNTRIES
    if( e.parentElement.getAttribute("id") === "country-options-ul" ) {

        // if it's already select remove it
        if (e.getAttribute("class") === "select-country") {

            e.classList.remove("select-country");
            // e.children[0].classList.remove("country-selected"); // remove country-selected class to it so we make sure we grab all the ones the user wanted

        } else {

            e.classList.add("select-country");
            // e.children[0].classList.add("country-selected"); // add country-selected class to the span so we can grab all the ones clicked on

        }

        disableCountryCountBox(); // check to see if we should disable the count box

    }



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

    const checkbox = document.getElementById("select-all-country-checkbox");

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


async function playWithFriends() {

    let gameOptions = {};

    let gameMode = document.getElementById('settings-game-mode').children[0].innerText;
    let extraGameMode = document.getElementById('settings-extra-game-mode').children[0].innerText;

    gameOptions.gameMode = gameMode;
    gameOptions.extraGameMode = extraGameMode;

    let countryCount = document.getElementById('country-count').value;

    // get all countries highlighted
    let countries = document.getElementsByClassName('select-country');

    // user selected a country count
    if (parseInt(countryCount) > 0) {

        gameOptions.countryCount = countryCount;

    // user selected countries
    } else if( countries.length > 0) {

        let countriesArray = [];


        // add them to the array
        for (let x = 0; x < countries.length; x++) {

            countriesArray[x] = countries[x].children[0].innerHTML;
        }

        gameOptions.countriesArray = countriesArray;

    // tell user that count cannot be less than 1 or greater than 9
    }else{

        let messageParagraph = document.getElementById("country-count-message");

        messageParagraph.innerText = `Count cannot be less than 1 or greater than ${ document.getElementsByClassName('country').length }`;
        return; // user cannot successfully start game
    }

    let selectAllCountriesBox = document.getElementById("add-selected-country-checkbox");

    gameOptions.addAllCountries = selectAllCountriesBox.checked;


    localStorage.setItem("game-options", JSON.stringify(gameOptions));


    console.log(localStorage.getItem('game-options'))

    let getSessionID = await fetch(

        "/create-session",
        {
            method: 'POST',
            headers : {

                'Content-type' : 'application/json'
            },
            body : JSON.stringify({
                gameOptions: localStorage.getItem('game-options')
            })
        }
    ).then(
        resp => resp.json()
    ).catch(
        (e)=> console.log(e)
    );

    // take user to session
    // window.location.href = `/play/session?id=${getSessionID}`;
    window.location.href = `/session?id=${getSessionID}`;

}

// set options for creator and players in settings when connected
function setOptions(){

    let gameOptions = JSON.parse(localStorage.getItem('game-options'));

    let gameModes = document.getElementById('game-modes-ul');

    // select game mode
    for( let x = 0; x < gameModes.children.length; x++ ){

        if( gameModes.children[x].children[0].innerText === gameOptions.gameMode ){

            gameModes.children[x].click();
        }
    }

    // select extra game mode
    let extraGameModes = document.getElementById('extra-game-modes-ul');

    // select game mode
    for( let x = 0; x < extraGameModes.children.length; x++ ){

        if( extraGameModes.children[x].children[0].innerText === gameOptions.extraGameMode ){

            extraGameModes.children[x].click();
        }
    }


    // select country count or countries
    let countryCountInput = document.getElementById('country-count');

    // user selected a country count
    if( gameOptions.countryCount && parseInt(gameOptions.countryCount) > 0 ){

        countryCountInput.value = gameOptions.countryCount;

    // user selected countries
    }else{

        // countries may not load in time to go through all
        let checkAllCountriesLoaded = setInterval(()=>{

            if( document.getElementById('country-options-ul').children.length >= 11 ){

                // get all countries highlighted
                let countries = document.getElementById('country-options-ul');

                // skips search option li and select all toggle
                for(  let x = 2; x < countries.children.length; x++ ){

                    for( let y = 0; y < gameOptions.countriesArray.length; y++ ){

                        if( countries.children[x].children[0].innerText === gameOptions.countriesArray[y] ){

                            countries.children[x].click();

                        }
                    }

                }

                clearInterval(checkAllCountriesLoaded);

            }
        })

    }

    if( gameOptions.addAllCountries ){

        let selectAllCountriesBox = document.getElementById("add-selected-country-checkbox");

        selectAllCountriesBox.click();
    }

}




