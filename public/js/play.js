import {Globe} from "./Globe.js";
import {UserAuthAPI} from "./userAuthAPI.js";



async function main(){


    const globe = new Globe();

    let userAuthAPI = new UserAuthAPI();

    let userInfo = await userAuthAPI.userInfo();

    globe.initGlobe();
    globe.addButtons();

    // check when the globe and fetch responses have loaded
    const checkResources = setInterval(()=>{

        if( typeof globe.earth !== "undefined" && globe.game.getSelectedCountries().length > 0 ) {

            // show actual screen
            document.getElementById("settings-box").classList.remove("hide");
            document.getElementById("start-button").classList.remove("hide");

            document.getElementById("loader-container").classList.add("hide");
            document.getElementById("loader-container").classList.remove("loader-container");
            document.getElementsByTagName("CANVAS")[0].style.display = "block";


            // load nav content
            let navMenu = document.getElementById('nav-menu');

            // if user exits, display their name and remove sign up button
            if( userInfo.length > 0 ){

                navMenu.innerHTML = `
                
                <li id="home-nav-item" class="" onclick="window.location ='/'"><img class="home-img" src="../favicon.ico" alt=""></li>
                <li id="stats-nav-item" class="nav-items" onclick="window.location ='/stats'">Stats</li>
                <li id="about-nav-item" class="nav-items" onclick="window.location ='/about'">About</li>
                <li id="settings-nav-item" class="nav-items" onclick="window.location ='/settings'">Settings</li>
            
                `;

            }else{

                navMenu.innerHTML = `
                
                <li id="home-nav-item" class="" onclick="window.location ='/'"><img class="home-img" src="../favicon.ico" alt=""></li>
                <li id="signup-nav-item" class="nav-items" onclick="window.location ='/register'">Sign Up</li>
                <li id="login-nav-item" class="nav-items" onclick="window.location ='/login'">Login</li>
                <li id="about-nav-item" class="nav-items" onclick="window.location ='/about'">About</li>
            
            `;
            }

            clearInterval(checkResources);

        }
    },1000)

}

main();


