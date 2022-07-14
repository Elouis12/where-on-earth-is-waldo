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
    AmbientLight,
    PointLight,
    Clock,
    RingGeometry,
    Vector3,
    PlaneGeometry,
    CameraHelper,
    Group,
    MeshPhongMaterial

} from "https://cdn.skypack.dev/three@0.137";
// import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
import anime from 'https://cdn.skypack.dev/animejs@3.2.1';



const scene = new Scene();

let sunBackground = document.querySelector(".sun-background");
let moonBackground = document.querySelector(".moon-background");

const ringsScene = new Scene();

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 15, 50);

const ringsCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
ringsCamera.position.set(0, 0, 50);

// CREATE RENDERER TO THE DOM
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

let earth,
    controls,
    sunLight,
    ambientLight,
    pointLight,
    moonLight,
    ring1,
    ring2,
    ring3,
    cloudMesh

let mousePos = new Vector2(0,0);

// TEXTURES
let pmrem = new PMREMGenerator(renderer);
/*let envmapTexture = await new RGBELoader()
    .setDataType(FloatType)
    .loadAsync("assets/old_room_2k.hdr");*/  // thanks to https://polyhaven.com/hdris !
// let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

let textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    bump: await new TextureLoader().loadAsync("assets/textures/earthbump.jpg"),
    map: await new TextureLoader().loadAsync("assets/textures/earthmap.jpg"),
    spec: await new TextureLoader().loadAsync("assets/textures/earthspec.jpg"),
    planeTrailMask: await new TextureLoader().loadAsync("assets/textures/trail.png"),
};

// Important to know!
// textures.map.encoding = sRGBEncoding;
function setObjectsToScene(){


    // ADD SUN LIGHT
    sunLight = new DirectionalLight(
        new Color("#FFFFFF").convertSRGBToLinear(),
        0.5/*0.2*/,
    );

    sunLight.position.set(-100, -100, -100/*10, 20, 10*/);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 0/*512*/;
    sunLight.shadow.mapSize.height = 0/*512*/;
    sunLight.shadow.camera.near =   1/*0.5*/;
    sunLight.shadow.camera.far = 1/*100*/;
    sunLight.shadow.camera.left = 1/*-10*/;
    sunLight.shadow.camera.bottom = 1/*-10*/;
    sunLight.shadow.camera.top = 1/*10*/;
    sunLight.shadow.camera.right = 1/*10*/;
    sunLight.position.set(-100, -100, -100);
    sunLight.castShadow = true;
    // scene.add(sunLight);


    // ADD AMBIENT LIGHT
    ambientLight = new AmbientLight( "#77ccff", 1 ); // shows all the objects
    scene.add( ambientLight );

    // ADD POINT LIGHT
    pointLight = new PointLight( "#77ccff", 1 ); // light pointing to the object
    pointLight.position.set( 5, 3, 5 );
    // scene.add( pointLight );


    // ADD MOONLIGHT
    moonLight = new DirectionalLight(
        new Color("#77ccff").convertSRGBToLinear(),
        0,
    );
    moonLight.position.set(100, 100, 100);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 0/*512*/;
    moonLight.shadow.mapSize.height = 0/*512*/;
    moonLight.shadowCameraNear = 1;
    moonLight.shadowCameraFar = 1;
    moonLight.shadowCameraLeft = 1;
    moonLight.shadowCamerBottom = 1;
    moonLight.shadowCameraTop = 1;
    moonLight.shadowCameraRight = 1;
    scene.add(moonLight);

    // // Create a helper for the shadow camera (optional)
    // const helper = new CameraHelper( light.shadow.camera );
    // scene.add( helper );

    // ORBIT CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.dampingFactor = 0.05;
    controls.enableDamping = true;



    // ADD EARTH
    earth = new Mesh(
        new SphereGeometry(10, 70, 70),
        new MeshPhysicalMaterial({
            map: textures.map,
            roughnessMap: textures.spec,
            bumpMap: textures.bump,
            bumpScale: 0.2 /*0.05*/,
            // envMap,
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
    scene.add(earth);


    /* ADD CLOUDS */
    const cloudGeometry = new SphereGeometry(10.2, 70, 140);
    const cloudMaterial = new MeshPhongMaterial({

        map : new TextureLoader().load("./assets/textures/earthCloud.png"),
        transparent : true
    });

    cloudMesh = new Mesh( cloudGeometry, cloudMaterial );
    cloudMesh.sunEnvIntensity = 0.4;
    cloudMesh.moonEnvIntensity = 0.1;
    cloudMesh.rotation.y -= Math.PI;
    cloudMesh.receiveShadow = true;
    earth.add( cloudMesh );

    // ADD RINGS
    ring1 = new Mesh(
        new RingGeometry(15, 13.5, 80, 1, 0),
        new MeshPhysicalMaterial({
            color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(200),
            roughness: 0.25,
            // envMap,
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

    ring2 = new Mesh(
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

    ring3 = new Mesh(
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

    /*let earthGroup = new Group();

    earthGroup.add(sphere);
    earthGroup.add(ring1);
    earthGroup.add(ring2);
    earthGroup.add(ring3);

    scene.add( earthGroup );*/


}

function calcPosFromLatLongRad(){

    let phi
}


function addCountryCoord(/*earth, countriesArray, */ longitude, latitude){

    let pointOInterest = new SphereGeometry( .1, 32, 32 );

    let lat = ( latitude ) * (Math.PI/180);
    let lon = ( longitude ) * (Math.PI/180);

    const radius = 10;
    const phi = (90-lat) * (Math.PI/180);
    const theta = (lon+180) * (Math.PI/180);

    let material = new MeshBasicMaterial({

        color : "pink",
    });

    /*
        long + 71
        lat + 71
    */
    let mesh =  new Mesh( pointOInterest, material );

    mesh.position.set(

        /*Math.cos(lat) * Math.cos(lon) * radius,
        Math.sin(lat) * radius,
        Math.cos(lat) * Math.sin(lon) * radius*/


       /* Math.sin(lat) * radius,
        Math.cos(lat) * Math.cos(lon) * radius,
        Math.cos(lat) * Math.sin(lon) * radius*/

        -(radius) * ( Math.cos(phi) ) * Math.cos( theta ),
        (radius) * ( Math.sin(phi) ),
        (radius) * ( Math.cos(phi) ) * Math.sin(theta)
    );

    mesh.rotation.set( 0.0, -lon, lat-Math.PI * 0.5 ); // allows it to rotate of that long / lat


    mesh.userData.country = "America"; // so when we raycast we can determine if correct


    earth.add(mesh)

}
(async function () {

    await setObjectsToScene(); // sets all the objects we need

    // addCountryCoord(27.6648, 152.5158);
    // addCountryCoord(107.7783, 190.4179);

    // MAKE PLANES
    // https://sketchfab.com/3d-models/cartoon-plane-f312ec9f87794bdd83630a3bc694d8ea#download
    // "Cartoon Plane" (https://skfb.ly/UOLT) by antonmoek is licensed under Creative Commons Attribution
    // (http://creativecommons.org/licenses/by/4.0/).
    let plane = (await new GLTFLoader().loadAsync("assets/plane/scene.glb")).scene.children[0];
    let planesData = [
        makePlane(plane, textures.planeTrailMask,/* envMap,*/ scene),
        makePlane(plane, textures.planeTrailMask,/* envMap,*/ scene),
        makePlane(plane, textures.planeTrailMask,/* envMap,*/ scene),
        makePlane(plane, textures.planeTrailMask,/* envMap,*/ scene),
        makePlane(plane, textures.planeTrailMask,/* envMap,*/ scene),
    ];

    // ADD METEORITE
    let meteorite = (await new GLTFLoader().loadAsync("assets/meteorite/scene.gltf")).scene;
    meteorite.scale.set(0.001, 0.001, 0.001);
    meteorite.position.set(0,0,0);
    meteorite.rotation.set(0,0,0);
    meteorite.updateMatrixWorld();
    cloudMesh.add(meteorite);
    /*

        let daytime = true;
        let animating = false;
        window.addEventListener("mousemove", (e) => {
            if(animating) return;

            let anim = [0, 1];

            if(e.clientX > (innerWidth - 200) && !daytime) {
                anim = [1, 0];
            } else if(e.clientX < 200 && daytime) {
                anim = [0, 1];
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
                    sunLight.intensity = 3.5 * (1-obj.t);
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

                    ringsScene.children.forEach((child, i) => {
                        child.traverse((object) => {
                            object.material.opacity = object.sunOpacity * (1-obj.t) + object.moonOpacity * obj.t;
                        });
                    });

                    sunBackground.style.opacity = 1-obj.t;
                    moonBackground.style.opacity = obj.t;
                },
                easing: 'easeInOutSine',
                duration: 500,
            });
        });
    */


    let clock = new Clock();

    renderer.setAnimationLoop(() => {

        let delta = clock.getDelta();
        earth.rotation.y += delta * 0.05;

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


        // meteorite.rotation.y += 0.0025;
        // meteorite.rotateOnAxis(new Vector3(nr(), nr(), nr()).normalize(), Math.random() * Math.PI * 2); // random axis
        // meteorite.rotateOnAxis(new Vector3(0, 1, 0), Math.PI * 2);    // y-axis rotation
        // meteorite.rotateOnAxis(new Vector3(0, 0, 1), Math.random() * Math.PI * 0.45 + Math.PI * 0.05);    // this decides the radius
        // meteorite.translateY(10.5 + Math.random() * 1.0);
        // meteorite.rotateOnAxis(new Vector3(1,0,0), +Math.PI * 0.5);


        renderer.autoClear = false;
        renderer.render(ringsScene, ringsCamera);
        renderer.autoClear = true;

        earth.rotation.y += /*Math.PI **/ 0.00125;
        cloudMesh.rotation.y += /*Math.PI **/ 0.0010;
    });
})();

function nr() {
    return Math.random() * 2 - 1;
}

function makePlane(planeMesh, trailTexture, /*envMap,*/ scene) {
    let plane = planeMesh.clone();
    plane.scale.set(0.001, 0.001, 0.001);
    plane.position.set(0,0,0);
    plane.rotation.set(0,0,0);
    plane.updateMatrixWorld();

    plane.traverse((object) => {
        if(object instanceof Mesh) {
            // object.material.envMap = envMap;
            object.sunEnvIntensity = 1;
            object.moonEnvIntensity = 0.3;
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });

    let trail = new Mesh(
        new PlaneGeometry(1, 2),
        new MeshPhysicalMaterial({
            // envMap,
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

    camera.aspect = window.innerWidth / window.innerHeight; // resets camera
    camera.updateProjectionMatrix(); // update the camera to that
    renderer.setPixelRatio( window.devicePixelRatio ); // take the pixel ratio of the device
    renderer.setSize( window.innerWidth, window.innerHeight ); // resets renderer


}
window.addEventListener( 'resize', onWindowResize )