import {Globe} from "./Globe.js";



function main(){


    const globe = new Globe();

    globe.initGlobe();
    globe.addButtons();


    // check when the globe and fetch responses have loaded
    const checkResources = setInterval(()=>{

        if( typeof globe.earth !== "undefined" && globe.game.getCountries().length > 0 ) {

            // show actual screen
            document.getElementById("settings-box").classList.remove("hide");
            document.getElementById("start-button").classList.remove("hide");

            document.getElementById("loader").classList.add("hide");
            document.getElementsByTagName("CANVAS")[0].style.display = "block";

            clearInterval(checkResources);

        }
    },1000)

}

function showLoadingScreen(){


}

main();


