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
import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
import anime from 'https://cdn.skypack.dev/animejs@3.2.1';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';


/* CLASSES IMPORTS */
import {Game} from "./Game.js";


/*
    GLOBAL VARIABLES
*/

let scene,
    earth,
    camera,
    renderer,
    sunLight,
    moonLight,
    domEvents;

let earthRadius = 10;


let sunBackground = document.querySelector(".sun-background");
let moonBackground = document.querySelector(".moon-background");

let countryObjects = []; // to use when raycasting

let mousePos = new Vector2(0,0);


/*
    GET X Y Z POSITION FROM THE COUNTRIES LAT AND LONG POSITIONS
*/
function calcPosFromLatLonRad(lat,lon,radius){

    let phi   = (90-lat)*(Math.PI/180);
    let theta = (lon+180)*(Math.PI/180);

    let x = -((radius) * Math.sin(phi)*Math.cos(theta));
    let z = ((radius) * Math.sin(phi)*Math.sin(theta));
    let y = ((radius) * Math.cos(phi));


    return [x,y,z];
}

/*
    ADD THE POINTS TO THE GLOBE
*/
async function addPoints(radius, countryArray, countryCount){


    /* POINT OF INTEREST */
    let geometry = new SphereGeometry(0.1, 20, 20);

    alert(countryCount)
    for( let x = 0; x < countryCount; x+=1 ){

        if( /*coordinates[x].Country === "United States" ||
            coordinates[x].Country === "France" ||
            coordinates[x].Country === "Australia"*/ true ){

            let calCoords = calcPosFromLatLonRad( Number(countryArray[x].lat), Number(countryArray[x].lon), radius );

            let material = new MeshBasicMaterial(/*{color: new Color('pink')}*/)

            material.color = new Color( /*`rgb(
                ${Math.floor( Math.random() * 256 )},
                ${Math.floor( Math.random() * 256 )},
                ${Math.floor( Math.random() * 256 )})`*/
                "white"
            );

            let pointOfInterestMesh = new Mesh(geometry, material);
            pointOfInterestMesh.scale.set(1, 1, 1);
            material.wireframe = true;
            pointOfInterestMesh.userData.country = countryArray[x].country;
            pointOfInterestMesh.position.set(calCoords[0], calCoords[1], calCoords[2]);

            countryObjects.push(pointOfInterestMesh);
            earth.add(pointOfInterestMesh);

        }

    }
}

/*
    SET RAY CASTERS TO GET OBJECTS / COUNTRIES
*/
function setRayCasters(){


    // WHEN THE USER CLICKS (THE RIGHT) POINT(S)
    document.addEventListener("pointerdown", onPointerDown);
    function onPointerDown(event) {

        // event.preventDefault();

        const mouse3D =  new Vector2(
            event.clientX / window.innerWidth * 2 - 1,
            -event.clientY / window.innerHeight * 2 + 1
        );

        const raycaster = new Raycaster();

        raycaster.setFromCamera(mouse3D, camera);

        const intersects = raycaster.intersectObjects(countryObjects);

    }

    // WHEN THE USER HOVERS OVER A POINT HIGHLIGHT
    document.addEventListener("pointermove", onPointerMove);
    function onPointerMove(event) {

        // event.preventDefault();

        const mouse3D =  new Vector2(
            event.clientX / window.innerWidth * 2 - 1,
            -event.clientY / window.innerHeight * 2 + 1
        );

        const raycaster = new Raycaster();

        raycaster.setFromCamera(mouse3D, camera);

        const intersects = raycaster.intersectObjects(countryObjects);



        if (intersects.length > 0 && intersects[0].object.userData.country ) {

            intersects[0].object.material.color.setHex(26367);

            document.body.style.cursor = "pointer"; // make pointer

        }else{

            document.body.style.cursor = "default"; // chnage back to default

            countryObjects.forEach( ( country )=>{

                if( country.userData.country ){ // if it is a country because we also added earth

                    if( country.material.color.getHex() === 26367 ){ // so we don't apply it to all countries, only the one with blue

                        // give them the color white
                        country.material.color.setHex(16777215);
                    }
                }

            } );

        }

    }
}

let daytime = true;
let animating = false;

function setDay(){

    // let daytime = true;
    // let animating = false;
    document.getElementById("toggle-button").addEventListener("click", (e) => {

        let themeButton = document.getElementById("toggle-button");



        if(animating) return;

        let anim = [0, 1];

        if(!daytime) {
            anim = [1, 0];
            document.body.setAttribute("style", "background : linear-gradient(45deg, rgb(255 219 158), rgb(253 243 220));");
            themeButton.setAttribute("class", "day");
            themeButton.setAttribute("title", "NIGHT");

        } else if(daytime) {
            anim = [0, 1];
            document.body.setAttribute("style", "background : linear-gradient(313deg, #0b1a2b 33%, #3a6291 111%);");
            themeButton.setAttribute("class", "night");
            themeButton.setAttribute("title", "DAY");

        } else {
            return;
        }

        animating = true;

        let obj = { t: 0 };
        anime({
            targets: obj,
            t: anim,
            complete: () => {
                animating = false;
                daytime = !daytime;
            },
            update: () => {
                sunLight.intensity = 0.1 * (1-obj.t);
                moonLight.intensity = 3.5 * obj.t;

                sunLight.position.setY(20 * (1-obj.t));
                moonLight.position.setY(20 * obj.t);

                earth.material.sheen = (1-obj.t);
                scene.children.forEach((child) => {
                    child.traverse((object) => {
                        if(object instanceof Mesh && object.material.envMap) {
                            object.material.envMapIntensity = object.sunEnvIntensity * (1-obj.t) + object.moonEnvIntensity * obj.t;
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

        window.localStorage.setItem("dayTime", daytime);
        window.localStorage.setItem("animating", animating);
    });

}

function loadDay(){


    daytime = JSON.parse( window.localStorage.getItem("dayTime") );
    animating = !JSON.parse( window.localStorage.getItem("animating") );

    document.getElementById("toggle-button").click();

}

(async function () {



    setRayCasters();

    /* SCENE */
    scene = new Scene();

    /* CAMERA */
    camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);

    camera.aspect = /*window.innerWidth*/300 / /*window.innerHeight*/300; // resets camera
    camera.updateProjectionMatrix(); // update the camera to that


    /* RENDERER */
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.outputEncoding = sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    document.getElementById("canvas-holder").appendChild(renderer.domElement);


    /* DOM EVENTS */
    // domEvents = new THREEx.DomEvents(camera, renderer.domElement);

    /* SUN */
    sunLight = new DirectionalLight(
        new Color("#FFFFFF").convertSRGBToLinear(),
        3.5,
    );
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 512;
    sunLight.shadow.mapSize.height = 512;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.right = 10;
    sunLight.intensity = 0.1
    scene.add(sunLight);

    /* MOON */
    moonLight = new DirectionalLight(
        new Color("#77ccff").convertSRGBToLinear(),
        0,
    );
    moonLight.position.set(-10, 20, 10);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 512;
    moonLight.shadow.mapSize.height = 512;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 100;
    moonLight.shadow.camera.left = -10;
    moonLight.shadow.camera.bottom = -10;
    moonLight.shadow.camera.top = 10;
    moonLight.shadow.camera.right = 10;
    scene.add(moonLight);

    /*
        AMBIENT LIGHT
    */
    const ambientLight = new AmbientLight( "#77ccff", 1 ); // shows all the objects
    scene.add( ambientLight );

    /*
        POINT LIGHT
    */
    const pointLight = new PointLight( "#77ccff", 1 ); // light pointing to the object
    pointLight.position.set( 5, 3, 5 );
    // scene.add( pointLight );


// // Create a helper for the shadow camera (optional)
// const helper = new CameraHelper( light.shadow.camera );
// scene.add( helper );


    /* ORBIT CONTROLS */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.dampingFactor = 0.05;
    controls.enableDamping = true;
    controls.minDistance = 15; // prevent the user from zooming too far in
    controls.maxDistance = 100; // prevent the user from zooming too far out
    controls.enableZoom = false;
    /* TEXTURES AND LOADERS */

    let hdrFile = "dry_cracked_lake_4k.hdr";
    let pmrem = new PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader()
        .setDataType(FloatType)
        .loadAsync(`assets/textures/${hdrFile}`);  // thanks to https://polyhaven.com/hdris !
    let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

    let textures = {
        // thanks to https://free3d.com/user/ali_alkendi !
        bump: await new TextureLoader().loadAsync("assets/textures/earthbump.jpg"),
        map: await new TextureLoader().loadAsync("assets/textures/earthmap.jpg"),
        spec: await new TextureLoader().loadAsync("assets/textures/earthspec.jpg"),
        planeTrailMask: await new TextureLoader().loadAsync("assets/textures/trail.png"),
        cloud: await new TextureLoader().load("./assets/textures/earthCloud.png")
    };

    // Important to know!
    // textures.map.encoding = sRGBEncoding;

    /* EARTH */
    earth = new Mesh(
        new SphereGeometry(earthRadius, 70, 70),
        new MeshPhysicalMaterial({
            map: textures.map,
            roughnessMap: textures.spec,
            bumpMap: textures.bump,
            bumpScale: 0.05,
            envMap,
            envMapIntensity: 0.4,
            sheen: 1,
            sheenRoughness: 0.75,
            sheenColor: new Color("#ff8a00").convertSRGBToLinear(),
            clearcoat: 0.5,
        }),
    );
    earth.sunEnvIntensity = 0.4;
    earth.moonEnvIntensity = 0.1;
    earth.rotation.y += Math.PI * 1.25;
    earth.receiveShadow = true;
    earth.userData.earth = "earth";
    countryObjects.push(earth);
    scene.add(earth);

    // await addPoints(earthRadius, game.getCountries(), game.getCountryCount());


/*    setDay();

    if( JSON.parse( window.localStorage.getItem("dayTime") ) ){


        loadDay();
    }*/



    /* CLOUDS */

    const cloudGeometry = new SphereGeometry(10.2, 70, 140);
    const cloudMaterial = new MeshPhongMaterial({

        map : new TextureLoader().load("./assets/textures/earthCloud.png"),
        transparent : true
    });

    const cloudMesh = new Mesh( cloudGeometry, cloudMaterial );
    cloudMesh.sunEnvIntensity = 0.4;
    cloudMesh.moonEnvIntensity = 0.1;
    cloudMesh.rotation.y += Math.PI * 1.25;
    cloudMesh.receiveShadow = true;
    scene.add( cloudMesh );

    /* RINGS */
    const ringsScene = new Scene();

    const ringsCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
    ringsCamera.position.set(0, 0, 50);

    const ring1 = new Mesh(
        new RingGeometry(15, 13.5, 80, 1, 0),
        new MeshPhysicalMaterial({
            color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(200),
            roughness: 0.25,
            envMap,
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

    // https://sketchfab.com/3d-models/cartoon-plane-f312ec9f87794bdd83630a3bc694d8ea#download
    // "Cartoon Plane" (https://skfb.ly/UOLT) by antonmoek is licensed under Creative Commons Attribution
    // (http://creativecommons.org/licenses/by/4.0/).
    let plane = (await new GLTFLoader().loadAsync("assets/plane/scene.glb")).scene.children[0];
    let planesData = [
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
    ];



    let clock = new Clock();

    renderer.setAnimationLoop(() => {

        let delta = clock.getDelta();
        earth.rotation.y += delta * 0.025/*0.05*/;
        cloudMesh.rotation.y += delta * 0.05;

        controls.update();
        renderer.render(scene, camera);

        ring1.rotation.x = ring1.rotation.x * 0.95 + mousePos.y * 0.05 * 1.2;
        ring1.rotation.y = ring1.rotation.y * 0.95 + mousePos.x * 0.05 * 1.2;

        ring2.rotation.x = ring2.rotation.x * 0.95 + mousePos.y * 0.05 * 0.375;
        ring2.rotation.y = ring2.rotation.y * 0.95 + mousePos.x * 0.05 * 0.375;

        ring3.rotation.x = ring3.rotation.x * 0.95 - mousePos.y * 0.05 * 0.275;
        ring3.rotation.y = ring3.rotation.y * 0.95 - mousePos.x * 0.05 * 0.275;


        planesData.forEach(planeData => {
            let plane = planeData.group;

            plane.position.set(0,0,0);
            plane.rotation.set(0,0,0);
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
            plane.rotateOnAxis(new Vector3(1,0,0), +Math.PI * 0.5);
        });

        renderer.autoClear = false;
        renderer.render(ringsScene, ringsCamera);
        renderer.autoClear = true;
    });
})();

function nr() {
    return Math.random() * 2 - 1;
}

function makePlane(planeMesh, trailTexture, envMap, scene) {
    let plane = planeMesh.clone();
    plane.scale.set(0.001, 0.001, 0.001);
    plane.position.set(0,0,0);
    plane.rotation.set(0,0,0);
    plane.updateMatrixWorld();

    plane.traverse((object) => {
        if(object instanceof Mesh) {
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
        randomAxis: new Vector3(nr(), nr(), nr()).normalize(),
        randomAxisRot: Math.random() * Math.PI * 2,
    };
}

window.addEventListener("mousemove", (e) => {
    let x = e.clientX - innerWidth * 0.5;
    let y = e.clientY - innerHeight * 0.5;

    mousePos.x = x * 0.0003;
    mousePos.y = y * 0.0003;
});


function onWindowResize(){ // everytime we call this, it will fit it according to the newly changed size

    camera.aspect = /*window.innerWidth*/300 / /*window.innerHeight*/300; // resets camera
    camera.updateProjectionMatrix(); // update the camera to that
    renderer.setPixelRatio( window.devicePixelRatio ); // take the pixel ratio of the device
    renderer.setSize( 300, 300 ); // resets renderer

}
window.addEventListener( 'resize', onWindowResize )