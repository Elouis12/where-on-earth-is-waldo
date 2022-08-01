function changeText(e){

    let value = e.children[0].innerHTML;
    let fullValue = e.innerHTML;
    let textDiv = e.parentElement.parentElement.children[0].children[1];

    textDiv.innerHTML = fullValue;

    const difficulty = document.getElementById("difficulty-ul");
    const gameMode = document.getElementById("settings-game-mode").children[0].innerText;

    // put strikethrough on difficulty if user clicked game mode other than hints
    if(
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

}
