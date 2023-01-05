import {Globe} from "./Globe.js";



function main(){


    const globe = new Globe();

    globe.initGlobe();

    // check when the globe and fetch responses have loaded
    const checkResources = setInterval(()=>{

        if( typeof globe.earth !== "undefined") {

            // show globe

            document.getElementById("loader").classList.add("hide");
            document.getElementsByTagName("CANVAS")[0].style.display = "block";

            clearInterval(checkResources);

        }
    },1000)

}



main();