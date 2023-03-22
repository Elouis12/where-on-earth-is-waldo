/*
    RENDERS THE GLOBE
*/

import {
    DoubleSide,
    PCFSoftShadowMap,
    MeshPhysicalMaterial,
    TextureLoader,
    FloatType,
    PMREMGenerator,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    ACESFilmicToneMapping,
    sRGBEncoding,
    Mesh,
    SphereGeometry,
    BoxGeometry,
    MeshBasicMaterial,
    Vector2,
    DirectionalLight,
    Clock,
    RingGeometry,
    Vector3,
    PlaneGeometry,
    CameraHelper,
    Group,
    Raycaster,
    AmbientLight,
    PointLight,
    MeshPhongMaterial

} from "https://cdn.skypack.dev/three@0.137";
import {RGBELoader} from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
import {OrbitControls} from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";
import {GLTFLoader} from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
import anime from 'https://cdn.skypack.dev/animejs@3.2.1';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';


/* CLASSES IMPORTS */
import {Game} from "./Game.js";
import * as socket from "https://cdn.socket.io/4.5.4/socket.io.min.js";


export class Globe {

    game;

    #scene;
    earth;
    #camera;
    #renderer;
    #sunLight;
    #moonLight;

    earthRadius = 10;


    #blackHexValue = 1052688;
    #redHexValue = 16731212;
    #whiteHexValue = 16777215;
    #lessWhiteHexValue = 16579836;


    #sunBackground = document.querySelector(".sun-background");
    #moonBackground = document.querySelector(".moon-background");

    #countryObjects = []; // to use when raycasting

    #mousePos = new Vector2(0, 0);

    #daytime = true;
    #animating = false;

    //
    controls;
    textures;
    cloudMesh;
    starMesh;
    planesData;

    pauseGlobeRotation = false;

    constructor() {


        this.game = new Game();
        this.clock = new Clock();


    }


    addButtons() {


        // add event to all start buttons
        let startButtons = document.getElementsByClassName('start-button');

        for( let x = 0; x < startButtons.length; x++ ){


            startButtons[x].addEventListener("click", async (e) => {

                /*if( !this.game.start() /!*user cannot start the game due to 0 country count*!/ ){

                    return;
                }*/

                // if starting from the session page, remove the waiting elements
                if (e.target.getAttribute("id") === "session-start-button") {


                    // send message to server socket to let all other client know to start
                    let socket = io();

                    let sessionID = window.location.href.split("=")[1];

                    await socket.emit("start-session", sessionID);

                    document.getElementById("session-wait-div").classList.add('hide');
                    document.getElementById("session-wait-div").classList.remove('session-wait-div');

                }

                this.game.start()

                // add dots

                // if user wants to add all points to the globe
                if (!this.game.userAddedAllCountries()) {

                    this.addPoints(this.game.getAllCountries(), this.game.getAllCountries().length);

                } else {

                    this.addPoints(this.game.getSelectedCountries(), this.game.getCountryCount(), true);

                }

            });


        }


        document.getElementById("get-hint-button").addEventListener("click", () => {

            this.game.getHint(); // getHint

        })

        document.getElementById("next-round-button").addEventListener("click", () => {


            // restart will be called
            if (this.game.getSelectedCountries().length <= 0) { // game is over

                // will populate country again with random country
                this.game.startNextRound(); // start the next round

                // add coords according to the populated countries
                // if user wants to add all points to the globe
                if( !this.game.userAddedAllCountries() ){

                    this.addPoints(this.game.getAllCountries(), this.game.getAllCountries().length);

                }else{

                    this.addPoints(this.game.getSelectedCountries(), this.game.getCountryCount(), true);

                }

            } else {

                this.game.startNextRound(); // start the next round

            }


        })


        document.getElementById("previous-button").addEventListener("click", () => {

            this.game.previous(); // get previous country

        });


        document.getElementById("next-button").addEventListener("click", () => {

            this.game.next(); // get next country

        });

    }

    /*
        GET X Y Z POSITION FROM THE COUNTRIES LAT AND LONG POSITIONS
    */
    #calcPosFromLatLonRad(lat, lon, radius) {

        let phi = (90 - lat) * (Math.PI / 180);
        let theta = (lon + 180) * (Math.PI / 180);

        let x = -((radius) * Math.sin(phi) * Math.cos(theta));
        let z = ((radius) * Math.sin(phi) * Math.sin(theta));
        let y = ((radius) * Math.cos(phi));


        return [x, y, z];
    }


    /*
        ADD THE POINTS TO THE GLOBE
    */
    addPoints(countryArray, countryCount, addAllPoints) {


        // user added a count greater than what the array holds
        if (countryCount > countryArray.length) {

            // entering the loop will give error, index out of bounds
            return;
        }


        // remove the ones already on the globe
        if (this.#countryObjects.length > 0) {

            this.earth.children = [];

            this.#countryObjects = []; // reset the country objects array
        }

        // uses either the amount of countries customly selected or the number of countries given in input box
        const listOfCountries = document.getElementsByClassName("select-country");
        // const countriesCount = listOfCountries.length > 0 ? this.game.getSelectedCountries().length : countryCount;

        const countriesCount = countryCount;

        /* POINT OF INTEREST */
        let geometry = new SphereGeometry(0.1, 20, 20);


        for (let x = 0; x < countriesCount; x += 1) {

            let calCoords = this.#calcPosFromLatLonRad(Number(countryArray[x].lat), Number(countryArray[x].lon), this.earthRadius);

            let material = new MeshBasicMaterial(/*{color: new Color('pink')}*/)

            material.color = new Color("white");

            let pointOfInterestMesh = new Mesh(geometry, material);
            pointOfInterestMesh.scale.set(1, 1, 1);
            material.wireframe = true;
            pointOfInterestMesh.userData.country = countryArray[x].country;
            pointOfInterestMesh.userData.selected = false; // when user gets it correct
            pointOfInterestMesh.userData.lat = countryArray[x].lat; // when user gets it correct
            pointOfInterestMesh.userData.lon = countryArray[x].lon; // when user gets it correct
            pointOfInterestMesh.position.set(calCoords[0], calCoords[1], calCoords[2]);

            // to iterate through ( use to see if user got point correct )
            this.#countryObjects.push(pointOfInterestMesh);

            // add them to the earth
            this.earth.add(pointOfInterestMesh);

        }

    }

    /*
        SET RAY CASTERS TO GET OBJECTS / COUNTRIES
    */
    #setRayCasters() {


        // WHEN THE USER CLICKS (THE RIGHT) POINT(S)
        document.addEventListener("pointerdown", async (event) => {

            const mouse3D = new Vector2(
                event.clientX / window.innerWidth * 2 - 1,
                -event.clientY / window.innerHeight * 2 + 1
            );

            const raycaster = new Raycaster();

            raycaster.setFromCamera(mouse3D, this.#camera);

            const intersects = raycaster.intersectObjects(this.#countryObjects);



            // IF ON THE CORRECT SCREEN THEN RETURN OR FOR MULTIPLAYER, IF WE SHOW THE WINNER SCREEN
            // because ex. us and canada are left, user click us correctly, only option left is canad
            // if user clicks canada while on the 'waldo has been found in US' screen it will give it correct
            // so prevent it by disabling other objects from being clicked
            if( !document.getElementById('next-round-button').classList.contains('hide')
                    ||
                !document.getElementById('winner-container').classList.contains('hideVisibility')
                ){

                return;
            }

            // IF BLACK ALREADY
            if (intersects.length > 0 && intersects[0].object.userData.selected) {

                return;

            }


            if (intersects.length > 0 && intersects[0].object.userData.country) {

                // country name associated with a white dot
                let answerPicked = intersects[0].object.userData.country;


                // USER GETS IT CORRECT
                if (this.game.answer(answerPicked)) {

                    // REMOVE IT FROM THE SCENE IF GAME MODE IS ELIMINATION
                    if (this.game.getExtraGameMode() === "elimination") {

                        this.earth.remove(intersects[0].object);

                    // USER IS PLAYING REGULAR MODE
                    }else{




// ADDING WALDO IMAGE
/*                                           // const waldoGeometry = new SphereGeometry(0.25, 20, 20);
                        const waldoGeometry = new BoxGeometry(0.25, 10, 10);
                        // const waldoGeometry = new SphereGeometry(0.1, 20, 20);
                        const waldoMaterial = new MeshPhongMaterial({

                            map: await new TextureLoader().load("./assets/images/waldo.png"),
                            transparent: true
                        });
     // grab the positions of the current point

                        let currentPosition = intersects[0].object.position;

                        // remove it
                        // this.earth.remove(intersects[0].object);

                        // add the waldo image
                        let pointOfInterestMesh = new Mesh(waldoGeometry, waldoMaterial);

                        // pointOfInterestMesh.rotation.y = Math.PI / 4;
                        pointOfInterestMesh.rotation.z = Math.PI / 2;
                        // this.#scene.remove(this.earth);
                        // this.#scene.add( pointOfInterestMesh );

                        pointOfInterestMesh.scale.set(1, 1, 1);
                        pointOfInterestMesh.position.set( currentPosition.x, currentPosition.y, currentPosition.z )

                        this.earth.remove(intersects[0].object);
                        this.earth.add( pointOfInterestMesh );*/

                        // set for already selected countries
                        intersects[0].object.userData.selected = true;
                        // set color of already used countries
                        intersects[0].object.material.color.setHex(this.#blackHexValue);

                        // multiplayer game has started
                        if(  window.location.href.includes("id") ){

                            let socket = io();

                            let gameOver = this.game.getSelectedCountries().length === 0;

                            let playerScores = this.game.getPlayerScores();

                            let sessionID = window.location.href.split("=")[1];


                            // get players will send error if not doing multiplayer
                            socket.emit('update-scores',
                                {
                                    sessionID : sessionID,
                                    scores : playerScores,
                                    gameOver : gameOver
                                }
                            );

                        }

                    }

                } else {

                    this.game.timesWrong++;

                    this.game.updateAttemptsCountDiv();

                    // show the blinking text
                    if (this.game.timesWrong === 3) {  // that way when it increases the count to 4 it won't re-loop the array and set the color again

                        document.getElementById("show-answer").classList.remove("hide");
                        document.getElementById("found-span").classList.add("hide");
                        document.getElementById("attempt-span").classList.add("hide");

                        for (let x = 0; x < this.#countryObjects.length; x += 1) {

                            // found the dot that matches the current country
                            if ((this.game.getSelectedCountries() !== null) && this.#countryObjects[x].userData.country === this.game.getSelectedCountries()[0].country) {

                                this.#countryObjects[x].material.color.setHex(this.#redHexValue);

                                // this.#countryObjects[x].material.color.setHex(this.#redHexValue);

                                let blinkDot = setInterval(() => {

                                    // when color is red change to white
                                    if (this.#countryObjects[x].material.color.getHex() === this.#redHexValue) {

                                        // used a less white value because on hover it will make it black as it's blinking
                                        this.#countryObjects[x].material.color.setHex(this.#lessWhiteHexValue);

                                        // make it white again
                                    } else {

                                        this.#countryObjects[x].material.color.setHex(this.#redHexValue);
                                    }

                                    // user selected the blinking dot
                                    if (this.#countryObjects[x].userData.selected) {

                                        // set to black
                                        this.#countryObjects[x].material.color.setHex(this.#blackHexValue);

                                        clearInterval(blinkDot);

                                        // when user clicks next or previous then that object will no longer match the first country in our game class
                                    } else if (
                                        this.#countryObjects[x].userData.country !== this.game.getSelectedCountries()[0].country
                                    ) {

                                        // set to white
                                        this.#countryObjects[x].material.color.setHex(this.#whiteHexValue);

                                        clearInterval(blinkDot);
                                    }

                                }, 500)
                                break;
                            }
                        }

                    }

                }

            }
        });

        // WHEN THE USER HOVERS OVER A POINT, HIGHLIGHT
        document.addEventListener("pointermove", (event) => {

            const mouse3D = new Vector2(
                event.clientX / window.innerWidth * 2 - 1,
                -event.clientY / window.innerHeight * 2 + 1
            );

            const raycaster = new Raycaster();

            raycaster.setFromCamera(mouse3D, this.#camera);

            const intersects = raycaster.intersectObjects(this.#countryObjects);


            // IF ON THE CORRECT SCREEN THEN RETURN
            // because ex. us and canada are left, user click us correctly, only option left is canad
            // if user clicks canada while on the 'waldo has been found in US' screen it will give it correct
            // so prevent it by disabling other objects from being clicked
            if( !document.getElementById('next-round-button').classList.contains('hide') ){

                this.pauseGlobeRotation = false;
                document.body.style.cursor = "default"; // make default pointer
                return;
            }

            // IF USER SELECTS A DOT NOT YET CORRECT
            if (
                intersects.length > 0
                    &&
                ( !intersects[0].object.userData.earth && !intersects[0].object.userData.selected )
            ) {

                this.pauseGlobeRotation = true; // to pause the globe's rotation when user hovers to try to make decision
                document.body.style.cursor = "pointer"; // make pointer

                // MAKE BLACK
                intersects[0].object.material.color.setHex(this.#blackHexValue);


            }else{

                this.pauseGlobeRotation = false; // continue the globe rotation
                document.body.style.cursor = "default"; // change back to default

                // PUT BACK TO WHITE
                this.#countryObjects.forEach((country) => {

                    if (!country.userData.selected) {  // set to back to white if the user did not get it correct already

                        if (country.material.color.getHex() === /*26367*/this.#blackHexValue) { // so we don't apply it to all countries, only the one with blue

                            // give them the color white
                            country.material.color.setHex(16777215);
                        }
                    }

                });
            }
        });

    }


    #showCorrectCountry(country) {

        let position = this.#calcPosFromLatLonRad(country.lat, country.lon, this.earthRadius);
        // this.earth.rotation.set( 0 /*0*/, position[1]/*0*/, position[2] /*0*/ );
        // this.earth.rotation.y = position[1];
        // this.earth.rotation.x = position[0];
        // this.#camera.lookAt( this.earth.position );
    }

    #setDay() {

        // let daytime = true;
        // let animating = false;
        // document.getElementById("toggle-button").addEventListener("click", (e) => {

        let themeButton = document.getElementById("toggle-button");


        if (this.#animating) return;

        let anim = [0, 1];

        if (!this.#daytime) {
            anim = [1, 0];
            // document.body.setAttribute("style", "background : linear-gradient(45deg, rgb(255 219 158), rgb(253 243 220));");
            // themeButton.setAttribute("class", "day");
            // themeButton.setAttribute("title", "NIGHT");

            window.localStorage.setItem("color", "linear-gradient(45deg, rgb(255 219 158), rgb(253 243 220))");

        } else if (this.#daytime) {
            anim = [0, 1];
            // document.body.setAttribute("style", "background : linear-gradient(313deg, #0b1a2b 33%, #3a6291 111%);");
            // themeButton.setAttribute("class", "night");
            // themeButton.setAttribute("title", "DAY");

            window.localStorage.setItem("color", "linear-gradient(313deg, #0b1a2b 33%, #3a6291 111%)");

        } else {
            return;
        }

        this.#animating = true;

        let obj = {t: 0};
        anime({
            targets: obj,
            t: anim,
            complete: () => {
                this.#animating = false;
                this.#daytime = !this.#daytime;
            },
            update: () => {
                this.#sunLight.intensity = 0.1 * (1 - obj.t);
                this.#moonLight.intensity = 3.5 * obj.t;

                this.#sunLight.position.setY(20 * (1 - obj.t));
                this.#moonLight.position.setY(20 * obj.t);

                this.earth.material.sheen = (1 - obj.t);
                this.#scene.children.forEach((child) => {
                    child.traverse((object) => {
                        if (object instanceof Mesh && object.material.envMap) {
                            object.material.envMapIntensity = object.sunEnvIntensity * (1 - obj.t) + object.moonEnvIntensity * obj.t;
                        }
                    });
                });

                /*ringsScene.children.forEach((child, i) => {
                    child.traverse((object) => {
                        object.material.opacity = object.sunOpacity * (1-obj.t) + object.moonOpacity * obj.t;
                    });
                });*/

                // sunBackground.style.opacity = 1-obj.t;
                // moonBackground.style.opacity = obj.t;
            },
            easing: 'easeInOutSine',
            duration: 500,
        });

        window.localStorage.setItem("dayTime", this.#daytime);
        window.localStorage.setItem("animating", this.#animating);
        // });

    }

    #loadDay() {


        this.#daytime = JSON.parse(window.localStorage.getItem("dayTime"));
        this.#animating = !JSON.parse(window.localStorage.getItem("animating"));
        // this.#animating = !JSON.parse(window.localStorage.getItem("animating"));

        // alert(window.localStorage.getItem("color"))
        // document.body.style.backgroundColor = window.localStorage.getItem("color");
        document.getElementById("toggle-button").click();

    }

    /* change to initEnvironment */
    async initGlobe() {


        /* BE ABLE TO RESIZE CANVAS AND OBJECTS WHEN SCREEN SIZE CHANGES */
        this.#onWindowResize(); // resizes the window

        /* SELECT OBJECTS ON GLOBE */
        this.#setRayCasters();

        /* SCENE */
        this.#scene = new Scene();

        /* CAMERA */
        this.#camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
        this.#camera.position.set(0, 15, 50);

        /* RENDERER */
        this.setRenderer();

        /* SUN */
        this.setSunLight();

        /* MOON */
        this.setMoonLight();

        /* AMBIENT LIGHT */
        this.setAmbientLight();

        /* POINT LIGHT */
        // this.setPointLight();

        /* ORBIT CONTROLS */
        this.setOrbitControls();

        /* TEXTURES AND LOADERS */
        await this.setTexturesAndLoaders();

        /* EARTH */
        await this.setEarth();

        this.#setDay();

        /*        if (JSON.parse(window.localStorage.getItem("dayTime"))) {


                    this.#loadDay();
                }*/

        /* CLOUDS */
        this.setClouds();


        /* STARS */
        this.setStars();

        /* RINGS */
        this.setRings();

        /* PLANES */
        await this.setPlanes();

        /* START ANIMATION */
        this.animate();
    }


    #nr() {
        return Math.random() * 2 - 1;
    }

    #makePlane(planeMesh, trailTexture, envMap, scene) {
        let plane = planeMesh.clone();
        plane.scale.set(0.001, 0.001, 0.001);
        plane.position.set(0, 0, 0);
        plane.rotation.set(0, 0, 0);
        plane.updateMatrixWorld();

        plane.traverse((object) => {
            if (object instanceof Mesh) {
                object.material.envMap = envMap;
                object.sunEnvIntensity = 1;
                object.moonEnvIntensity = 0.3;
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        let trail = new Mesh(
            new PlaneGeometry(1, 2),
            new MeshPhysicalMaterial({
                envMap,
                envMapIntensity: 3,

                roughness: 0.4,
                metalness: 0,
                transmission: 1,

                transparent: true,
                opacity: 1,
                alphaMap: trailTexture,
            })
        );
        trail.sunEnvIntensity = 3;
        trail.moonEnvIntensity = 0.7;
        trail.rotateX(Math.PI);
        trail.translateY(1.1);

        let group = new Group();
        group.add(plane);
        group.add(trail);

        scene.add(group);

        return {
            group,
            yOff: 10.5 + Math.random() * 1.0,
            rot: Math.PI * 2,  // just to set a random starting point
            rad: Math.random() * Math.PI * 0.45 + Math.PI * 0.05,
            randomAxis: new Vector3(this.#nr(), this.#nr(), this.#nr()).normalize(),
            randomAxisRot: Math.random() * Math.PI * 2,
        };
    }


    #onWindowResize() { // everytime we call this, it will fit it according to the newly changed size

        window.addEventListener('resize', () => {

            this.#camera.aspect = window.innerWidth / window.innerHeight; // resets camera
            this.#camera.updateProjectionMatrix(); // update the camera to that
            this.#renderer.setPixelRatio(window.devicePixelRatio); // take the pixel ratio of the device
            this.#renderer.setSize(window.innerWidth, window.innerHeight); // resets renderer

        })

    }

    setRenderer(){

        this.#renderer = new WebGLRenderer({antialias: true, alpha: true});
        this.#renderer.setSize(innerWidth, innerHeight);
        this.#renderer.toneMapping = ACESFilmicToneMapping;
        this.#renderer.outputEncoding = sRGBEncoding;
        this.#renderer.physicallyCorrectLights = true;
        this.#renderer.shadowMap.enabled = true;
        this.#renderer.shadowMap.type = PCFSoftShadowMap;
        // this.#renderer.domElement.style.display = "none"; // hides the canvas
        document.body.appendChild(this.#renderer.domElement);
        document.getElementsByTagName("CANVAS")[0].style.display = "none";

    }

    setSunLight(){

        this.#sunLight = new DirectionalLight(
            new Color("#FFFFFF").convertSRGBToLinear(),
            3.5,
        );
        this.#sunLight.position.set(10, 20, 10);
        this.#sunLight.castShadow = true;
        this.#sunLight.shadow.mapSize.width = 512;
        this.#sunLight.shadow.mapSize.height = 512;
        this.#sunLight.shadow.camera.near = 0.5;
        this.#sunLight.shadow.camera.far = 100;
        this.#sunLight.shadow.camera.left = -10;
        this.#sunLight.shadow.camera.bottom = -10;
        this.#sunLight.shadow.camera.top = 10;
        this.#sunLight.shadow.camera.right = 10;
        this.#sunLight.intensity = 0.1
        this.#scene.add(this.#sunLight);
    }

    setMoonLight(){

        this.#moonLight = new DirectionalLight(
            new Color("#77ccff").convertSRGBToLinear(),
            0,
        );
        this.#moonLight.position.set(-10, 20, 10);
        this.#moonLight.castShadow = true;
        this.#moonLight.shadow.mapSize.width = 512;
        this.#moonLight.shadow.mapSize.height = 512;
        this.#moonLight.shadow.camera.near = 0.5;
        this.#moonLight.shadow.camera.far = 100;
        this.#moonLight.shadow.camera.left = -10;
        this.#moonLight.shadow.camera.bottom = -10;
        this.#moonLight.shadow.camera.top = 10;
        this.#moonLight.shadow.camera.right = 10;
        this.#scene.add(this.#moonLight);
    }

    setAmbientLight(){

        const ambientLight = new AmbientLight("#77ccff", 1); // shows all the objects
        this.#scene.add(ambientLight);

    }

    setPointLight(){
        const pointLight = new PointLight("#77ccff", 1); // light pointing to the object
        pointLight.position.set(5, 3, 5);
        this.#scene.add( pointLight );
    }

    setOrbitControls(){

        this.controls = new OrbitControls(this.#camera, this.#renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.dampingFactor = 0.05;
        this.controls.enableDamping = true;
        this.controls.minDistance = 15; // prevent the user from zooming too far in
        this.controls.maxDistance = 100; // prevent the user from zooming too far out

    }

    async setTexturesAndLoaders(){

        let hdrFile = "dry_cracked_lake_4k.hdr";
        let pmrem = new PMREMGenerator(this.#renderer);
        let envmapTexture = await new RGBELoader()
            .setDataType(FloatType)
            .loadAsync(`assets/textures/${hdrFile}`);  // thanks to https://polyhaven.com/hdris !
        let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

        this.textures = {
            // thanks to https://free3d.com/user/ali_alkendi !
            bump: await new TextureLoader().loadAsync("assets/textures/earthbump.jpg"),
            map: await new TextureLoader().loadAsync("assets/textures/earthmap.jpg"),
            spec: await new TextureLoader().loadAsync("assets/textures/earthspec.jpg"),
            planeTrailMask: await new TextureLoader().loadAsync("assets/textures/trail.png"),
            cloud: await new TextureLoader().load("./assets/textures/earthCloud.png"),
            envMap
        };

    }

    async setEarth(){

        this.earth = new Mesh(
            new SphereGeometry(this.earthRadius, 70, 70),
            new MeshPhysicalMaterial({
                map: this.textures.map,
                roughnessMap: this.textures.spec,
                bumpMap: this.textures.bump,
                bumpScale: 0.25,
                // bumpScale: 1,
                // bumpScale: 0.5,
                // bumpScale: 0.05,
                envMap : this.textures.envMap,
                envMapIntensity: 0.4,
                sheen: 1,
                sheenRoughness: 0.75,
                sheenColor: new Color("#ff8a00").convertSRGBToLinear(),
                clearcoat: 0.5,
            }),
        );
        this.earth.sunEnvIntensity = 0.4;
        this.earth.moonEnvIntensity = 0.1;
        this.earth.rotation.y += Math.PI * 1.25;
        this.earth.receiveShadow = true;
        this.earth.userData.earth = "earth";
        this.#countryObjects.push(this.earth);
        this.#scene.add(this.earth);

        // await this.addPoints(this.game.getSelectedCountries(), this.game.getCountryCount());

    }

    setClouds(){

        const cloudGeometry = new SphereGeometry(10.2, 70, 140);
        const cloudMaterial = new MeshPhongMaterial({

            map: new TextureLoader().load("./assets/textures/earthCloud.png"),
            transparent: true
        });

        this.cloudMesh = new Mesh(cloudGeometry, cloudMaterial);
        this.cloudMesh.sunEnvIntensity = 0.4;
        this.cloudMesh.moonEnvIntensity = 0.1;
        this.cloudMesh.rotation.y += Math.PI * 1.25;
        this.cloudMesh.receiveShadow = true;
        this.#scene.add(this.cloudMesh);
    }

    setStars(){

        const starGeometry = new SphereGeometry(80, 140, 140);
        const starMaterial = new MeshBasicMaterial({ // this material does not interact with light, or light won't affect it

            map: new TextureLoader().load("./assets/textures/galaxy.png"),
            side: THREE.BackSide
        });

        this.starMesh = new Mesh(starGeometry, starMaterial);
        this.#scene.add(this.starMesh);

    }

    setRings(){

        const ringsScene = new Scene();

        const ringsCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
        ringsCamera.position.set(0, 0, 50);

        const ring1 = new Mesh(
            new RingGeometry(15, 13.5, 80, 1, 0),
            new MeshPhysicalMaterial({
                color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(200),
                roughness: 0.25,
                envMap : this.textures.envMap,
                envMapIntensity: 1.8,
                side: DoubleSide,
                transparent: true,
                opacity: 0.35,
            })
        );
        ring1.name = "ring";
        ring1.sunOpacity = 0.35;
        ring1.moonOpacity = 0.03;
        // ringsScene.add(ring1);

        const ring2 = new Mesh(
            new RingGeometry(16.5, 15.75, 80, 1, 0),
            new MeshBasicMaterial({
                color: new Color("#FFCB8E").convertSRGBToLinear(),
                transparent: true,
                opacity: 0.5,
                side: DoubleSide,
            })
        );
        ring2.name = "ring";
        ring2.sunOpacity = 0.35;
        ring2.moonOpacity = 0.1;
        // ringsScene.add(ring2);

        const ring3 = new Mesh(
            new RingGeometry(18, 17.75, 80),
            new MeshBasicMaterial({
                color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(50),
                transparent: true,
                opacity: 0.5,
                side: DoubleSide,
            })
        );
        ring3.name = "ring";
        ring3.sunOpacity = 0.35;
        ring3.moonOpacity = 0.03;
        // ringsScene.add(ring3);
    }

    async setPlanes(){

        let plane = (await new GLTFLoader().loadAsync("assets/plane/scene.glb")).scene.children[0];
        this.planesData = [
            this.#makePlane(plane, this.textures.planeTrailMask, this.textures.envMap, this.#scene),
            this.#makePlane(plane, this.textures.planeTrailMask, this.textures.envMap, this.#scene),
            this.#makePlane(plane, this.textures.planeTrailMask, this.textures.envMap, this.#scene),
            this.#makePlane(plane, this.textures.planeTrailMask, this.textures.envMap, this.#scene),
            this.#makePlane(plane, this.textures.planeTrailMask, this.textures.envMap, this.#scene),
        ];
    }


    animate(){

        this.#renderer.setAnimationLoop(() => {

            let delta = this.clock.getDelta();

            if( this.pauseGlobeRotation ){

                this.earth.rotation.y += delta * 0.001;

            }else{

                this.earth.rotation.y += delta * 0.025/*0.05*/;
                this.cloudMesh.rotation.y += delta * 0.05;
            }

            this.starMesh.rotation.y -= 0.0002;

            this.controls.update();

            this.#renderer.render(this.#scene, this.#camera);
            this.#renderer.autoClear = false;
            // this.#renderer.render(ringsScene, ringsCamera);
            this.#renderer.autoClear = true;
            /*
                        ring1.rotation.x = ring1.rotation.x * 0.95 + this.#mousePos.y * 0.05 * 1.2;
                        ring1.rotation.y = ring1.rotation.y * 0.95 + this.#mousePos.x * 0.05 * 1.2;

                        ring2.rotation.x = ring2.rotation.x * 0.95 + this.#mousePos.y * 0.05 * 0.375;
                        ring2.rotation.y = ring2.rotation.y * 0.95 + this.#mousePos.x * 0.05 * 0.375;

                        ring3.rotation.x = ring3.rotation.x * 0.95 - this.#mousePos.y * 0.05 * 0.275;
                        ring3.rotation.y = ring3.rotation.y * 0.95 - this.#mousePos.x * 0.05 * 0.275;
            */


            this.planesData.forEach(planeData => {
                let plane = planeData.group;

                plane.position.set(0, 0, 0);
                plane.rotation.set(0, 0, 0);
                plane.updateMatrixWorld();
                /**
                 * idea: first rotate like that:
                 *
                 *          y-axis
                 *  airplane  ^
                 *      \     |     /
                 *       \    |    /
                 *        \   |   /
                 *         \  |  /
                 *     angle ^
                 *
                 * then at the end apply a rotation on a random axis
                 */
                planeData.rot += delta * 0.25;
                plane.rotateOnAxis(planeData.randomAxis, planeData.randomAxisRot); // random axis
                plane.rotateOnAxis(new Vector3(0, 1, 0), planeData.rot);    // y-axis rotation
                plane.rotateOnAxis(new Vector3(0, 0, 1), planeData.rad);    // this decides the radius
                plane.translateY(planeData.yOff);
                plane.rotateOnAxis(new Vector3(1, 0, 0), +Math.PI * 0.5);
            });

        });

    }
}






