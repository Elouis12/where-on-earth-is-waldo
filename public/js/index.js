import {Globe} from "./Globe.js";
import {UserAuthAPI} from "./userAuthAPI.js";


async function main(){


    const globe = new Globe();

    let userAuthAPI = new UserAuthAPI();

    let userInfo = await userAuthAPI.userInfo();


    // tp make it faster? load the globe without stuff and inside the if add them?

    /*await*/ globe.initGlobe();



    // check when the globe and fetch responses have loaded
    const checkResources = setInterval(()=>{

        if( typeof globe.earth !== "undefined" /*true*/ ) {

            // show globe
            document.getElementById("loader-container").classList.add("hide");
            document.getElementById("loader-container").classList.remove("loader-container");
            document.getElementsByTagName("CANVAS")[0].style.display = "block";

            // load div content
            let introDiv = document.getElementById('intro');


            introDiv.innerHTML = `
            
                <h1>Where on Earth is Waldo?</h1>
                <p><span id="welcome-title">Welcome!</span> Waldo is on the run and we must catch him before he escapes.
                    Use your geographical knowledge to find him before he flees!
                </p>

                <button id="start-button" class="btn" onclick="window.location='/play'">Help Find Waldo</button>
                
            `

            // load nav content
            let navMenu = document.getElementById('nav-menu');

            // if user exits, display their name and remove sign up button
            if( userInfo.length > 0 ){

                // display user's id
                let welcomeTitle = document.getElementById('welcome-title')
                welcomeTitle.innerHTML = `Welcome, <span id="welcome-name">${userInfo[0].user_name}</span>!`;

                navMenu.innerHTML = `
                
                <li id="home-nav-item" class="" onclick="window.location ='/'"><img class="home-img" src="../favicon.ico" alt=""></li>
                <li id="stats-nav-item" class="nav-items" onclick="window.location ='/stats'">Stats</li>
                <li id="about-nav-item" class="nav-items" onclick="window.location ='/about'">About</li>
                <li id="about-nav-item" class="nav-items" onclick="window.location ='/settings'">Settings</li>
            
                `;

            }else{

                navMenu.innerHTML = `
                
                <li id="home-nav-item" class="" onclick="window.location ='/'"><img class="home-img" src="../favicon.ico" alt=""></li>
                <li id="signup-nav-item" class="nav-items" onclick="window.location ='/register'">Sign Up</li>
                <li id="login-nav-item" class="nav-items" onclick="window.location ='/login'">Login</li>
                <li id="about-nav-item" class="nav-items" onclick="window.location ='/about'">About</li>
            
            `;
            }


            /*globe.setStars();
            globe.setCloud();
            // globe.setSun();
            globe.setMoon();
            globe.setAmbientLight();*/

            clearInterval(checkResources);

        }
    },1000)

}



main();