function _0x3ede(){const _0x54fb88=['moonEnvIntensity','start-button','push','envMap','CANVAS','scale','initGlobe','#ff8a00','assets/textures/','add','setItem','type','setY','getExtraGameMode','rad','devicePixelRatio','./assets/textures/galaxy.png','getElementsByClassName','updateAttemptsCountDiv','.moon-background','toggle-button','./assets/textures/earthCloud.png','linear-gradient(45deg,\x20rgb(255\x20219\x20158),\x20rgb(253\x20243\x20220))','previous','localStorage','sheen','clone','sunOpacity','dayTime','traverse','country','shadow','querySelector','getElementById','364zsIilt','classList','normalize','bump','near','getHint','next-round-button','1678cVnexN','getItem','sin','pointermove','top','earthRadius','default','spec','next-button','color','setHex','map','position','found-span','aspect','cursor','assets/textures/earthbump.jpg','#FFFFFF','setPixelRatio','remove','appendChild','updateMatrixWorld','pointer','innerHeight','selected','answer','assets/textures/earthmap.jpg','game','white','6IhKlhH','load','length','domElement','getDelta','outputEncoding','multiplyScalar','material','next','getHex','setDataType','randomAxis','853455TRybld','width','castShadow','shadowMap','style','children','fromEquirectangular','#FFCB8E','planeTrailMask','addEventListener','click','group','rotation','rot','translateY','lat','getCountries','.sun-background','far','object','setSize','show-answer','lon','loadAsync','height','previous-button','addButtons','pointerdown','bottom','get-hint-button','left','minDistance','2427264jCcnjt','dry_cracked_lake_4k.hdr','clientX','getCountryCount','maxDistance','randomAxisRot','scene','set','camera','random','name','render','attempt-span','parse','clientY','setFromCamera','assets/textures/earthspec.jpg','yOff','442736EiEDtS','display','rotateOnAxis','1064664TxLQfg','convertSRGBToLinear','innerWidth','body','BackSide','cos','sunEnvIntensity','startNextRound','moonOpacity','intensity','802467ELXzsp','mapSize','addPoints','earth','userData','update','none','assets/plane/scene.glb','timesWrong','forEach','receiveShadow','linear-gradient(313deg,\x20#0b1a2b\x2033%,\x20#3a6291\x20111%)','ring','1224441NNggnp','autoClear','#77ccff','enableDamping','hide'];_0x3ede=function(){return _0x54fb88;};return _0x3ede();}const _0x4243a9=_0x2780;(function(_0x5919b4,_0x3d2779){const _0x93d2be=_0x2780,_0x35b47e=_0x5919b4();while(!![]){try{const _0x51b207=parseInt(_0x93d2be(0xf6))/0x1*(parseInt(_0x93d2be(0xef))/0x2)+parseInt(_0x93d2be(0xc8))/0x3+-parseInt(_0x93d2be(0xb1))/0x4+-parseInt(_0x93d2be(0x11f))/0x5*(-parseInt(_0x93d2be(0x113))/0x6)+-parseInt(_0x93d2be(0xae))/0x7+-parseInt(_0x93d2be(0x13f))/0x8+parseInt(_0x93d2be(0xbb))/0x9;if(_0x51b207===_0x3d2779)break;else _0x35b47e['push'](_0x35b47e['shift']());}catch(_0x44affc){_0x35b47e['push'](_0x35b47e['shift']());}}}(_0x3ede,0x5325f));import{DoubleSide,PCFSoftShadowMap,MeshPhysicalMaterial,TextureLoader,FloatType,PMREMGenerator,Scene,PerspectiveCamera,WebGLRenderer,Color,ACESFilmicToneMapping,sRGBEncoding,Mesh,SphereGeometry,MeshBasicMaterial,Vector2,DirectionalLight,Clock,RingGeometry,Vector3,PlaneGeometry,CameraHelper,Group,Raycaster,AmbientLight,PointLight,MeshPhongMaterial}from'https://cdn.skypack.dev/three@0.137';function _0x2780(_0x506e02,_0x51ac04){const _0x3ede3e=_0x3ede();return _0x2780=function(_0x278095,_0x36a98a){_0x278095=_0x278095-0xa1;let _0x1f78e0=_0x3ede3e[_0x278095];return _0x1f78e0;},_0x2780(_0x506e02,_0x51ac04);}import{RGBELoader}from'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader';import{OrbitControls}from'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';import{GLTFLoader}from'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader';import _0x181d98 from'https://cdn.skypack.dev/animejs@3.2.1';import*as _0xf1483f from'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';import{Game}from'./Game.js';export class Globe{[_0x4243a9(0x111)];#scene;[_0x4243a9(0xbe)];#camera;#renderer;#sunLight;#moonLight;['earthRadius']=0xa;#blackHexValue=0x101010;#redHexValue=0xff4c4c;#whiteHexValue=0xffffff;#lessWhiteHexValue=0xfcfcfc;#sunBackground=document[_0x4243a9(0xed)](_0x4243a9(0x130));#moonBackground=document['querySelector'](_0x4243a9(0xe0));#countryObjects=[];#mousePos=new Vector2(0x0,0x0);#daytime=!![];#animating=![];constructor(){const _0x4206be=_0x4243a9;this[_0x4206be(0x111)]=new Game();}[_0x4243a9(0x139)](){const _0x8fe6f8=_0x4243a9;document['getElementById'](_0x8fe6f8(0xce))['addEventListener'](_0x8fe6f8(0x129),()=>{const _0x299b00=_0x8fe6f8;this[_0x299b00(0x111)]['start'](),this[_0x299b00(0xbd)](this['game'][_0x299b00(0x12f)](),this[_0x299b00(0x111)][_0x299b00(0x142)]());}),document['getElementById'](_0x8fe6f8(0x13c))[_0x8fe6f8(0x128)]('click',()=>{const _0x3da538=_0x8fe6f8;this[_0x3da538(0x111)][_0x3da538(0xf4)]();}),document[_0x8fe6f8(0xee)](_0x8fe6f8(0xf5))[_0x8fe6f8(0x128)](_0x8fe6f8(0x129),()=>{const _0x2e0d1f=_0x8fe6f8;this['game'][_0x2e0d1f(0x12f)]()[_0x2e0d1f(0x115)]<=0x0?(this[_0x2e0d1f(0x111)][_0x2e0d1f(0xb8)](),this[_0x2e0d1f(0xbd)](this['game'][_0x2e0d1f(0x12f)](),this[_0x2e0d1f(0x111)][_0x2e0d1f(0x142)]())):this[_0x2e0d1f(0x111)][_0x2e0d1f(0xb8)]();}),document[_0x8fe6f8(0xee)](_0x8fe6f8(0x138))[_0x8fe6f8(0x128)]('click',()=>{const _0x288691=_0x8fe6f8;this['game'][_0x288691(0xe4)]();}),document[_0x8fe6f8(0xee)](_0x8fe6f8(0xfe))[_0x8fe6f8(0x128)](_0x8fe6f8(0x129),()=>{const _0x5118d0=_0x8fe6f8;this[_0x5118d0(0x111)][_0x5118d0(0x11b)]();});}#calcPosFromLatLonRad(_0xd04b96,_0x5e37d7,_0x29e486){const _0x271276=_0x4243a9;let _0x6b30fd=(0x5a-_0xd04b96)*(Math['PI']/0xb4),_0x2d3b3a=(_0x5e37d7+0xb4)*(Math['PI']/0xb4),_0x58f473=-(_0x29e486*Math['sin'](_0x6b30fd)*Math[_0x271276(0xb6)](_0x2d3b3a)),_0x190d10=_0x29e486*Math[_0x271276(0xf8)](_0x6b30fd)*Math['sin'](_0x2d3b3a),_0x98c5e9=_0x29e486*Math['cos'](_0x6b30fd);return[_0x58f473,_0x98c5e9,_0x190d10];}[_0x4243a9(0xbd)](_0x430791,_0x5b45f8){const _0x1df7dd=_0x4243a9;if(_0x5b45f8>_0x430791[_0x1df7dd(0x115)])return;this.#countryObjects['length']>0x0&&(this['earth'][_0x1df7dd(0x124)]=[],this.#countryObjects=[]);const _0x59e0e9=document[_0x1df7dd(0xde)]('select-country'),_0x280b7a=_0x59e0e9[_0x1df7dd(0x115)]>0x0?this[_0x1df7dd(0x111)][_0x1df7dd(0x12f)]()[_0x1df7dd(0x115)]:_0x5b45f8;let _0x4225f4=new SphereGeometry(0.1,0x14,0x14);for(let _0x4d1280=0x0;_0x4d1280<_0x280b7a;_0x4d1280+=0x1){let _0x73c74e=this.#calcPosFromLatLonRad(Number(_0x430791[_0x4d1280][_0x1df7dd(0x12e)]),Number(_0x430791[_0x4d1280][_0x1df7dd(0x135)]),this[_0x1df7dd(0xfb)]),_0x35a779=new MeshBasicMaterial();_0x35a779[_0x1df7dd(0xff)]=new Color(_0x1df7dd(0x112));let _0x1a6f8f=new Mesh(_0x4225f4,_0x35a779);_0x1a6f8f[_0x1df7dd(0xd2)][_0x1df7dd(0xa3)](0x1,0x1,0x1),_0x35a779['wireframe']=!![],_0x1a6f8f[_0x1df7dd(0xbf)]['country']=_0x430791[_0x4d1280][_0x1df7dd(0xeb)],_0x1a6f8f['userData'][_0x1df7dd(0x10e)]=![],_0x1a6f8f['userData'][_0x1df7dd(0x12e)]=_0x430791[_0x4d1280][_0x1df7dd(0x12e)],_0x1a6f8f[_0x1df7dd(0xbf)]['lon']=_0x430791[_0x4d1280][_0x1df7dd(0x135)],_0x1a6f8f[_0x1df7dd(0x102)][_0x1df7dd(0xa3)](_0x73c74e[0x0],_0x73c74e[0x1],_0x73c74e[0x2]),this.#countryObjects['push'](_0x1a6f8f),this[_0x1df7dd(0xbe)][_0x1df7dd(0xd6)](_0x1a6f8f);}}#setRayCasters(){const _0x2df6b3=_0x4243a9;document[_0x2df6b3(0x128)](_0x2df6b3(0x13a),_0x4d4d55=>{const _0x42ecd8=_0x2df6b3,_0x45579f=new Vector2(_0x4d4d55['clientX']/window[_0x42ecd8(0xb3)]*0x2-0x1,-_0x4d4d55[_0x42ecd8(0xaa)]/window[_0x42ecd8(0x10d)]*0x2+0x1),_0x244a89=new Raycaster();_0x244a89[_0x42ecd8(0xab)](_0x45579f,this.#camera);const _0x1580b1=_0x244a89['intersectObjects'](this.#countryObjects);if(_0x1580b1[_0x42ecd8(0x115)]>0x0&&_0x1580b1[0x0][_0x42ecd8(0x132)][_0x42ecd8(0xbf)][_0x42ecd8(0x10e)])return;if(_0x1580b1[_0x42ecd8(0x115)]>0x0&&_0x1580b1[0x0][_0x42ecd8(0x132)][_0x42ecd8(0xbf)][_0x42ecd8(0xeb)]){let _0x310018=_0x1580b1[0x0][_0x42ecd8(0x132)][_0x42ecd8(0xbf)][_0x42ecd8(0xeb)];if(this['game'][_0x42ecd8(0x10f)](_0x310018))this[_0x42ecd8(0x111)][_0x42ecd8(0xda)]()==='elimination'&&this[_0x42ecd8(0xbe)][_0x42ecd8(0x109)](_0x1580b1[0x0][_0x42ecd8(0x132)]),_0x1580b1[0x0][_0x42ecd8(0x132)]['userData'][_0x42ecd8(0x10e)]=!![],_0x1580b1[0x0]['object'][_0x42ecd8(0x11a)][_0x42ecd8(0xff)]['setHex'](this.#blackHexValue);else{this[_0x42ecd8(0x111)]['timesWrong']++,this['game'][_0x42ecd8(0xdf)]();if(this[_0x42ecd8(0x111)][_0x42ecd8(0xc3)]===0x3){document['getElementById'](_0x42ecd8(0x134))[_0x42ecd8(0xf0)][_0x42ecd8(0x109)]('hide'),document[_0x42ecd8(0xee)](_0x42ecd8(0x103))['classList'][_0x42ecd8(0xd6)](_0x42ecd8(0xcc)),document['getElementById'](_0x42ecd8(0xa8))['classList'][_0x42ecd8(0xd6)](_0x42ecd8(0xcc));for(let _0x5d2072=0x0;_0x5d2072<this.#countryObjects[_0x42ecd8(0x115)];_0x5d2072+=0x1){if(this.#countryObjects[_0x5d2072][_0x42ecd8(0xbf)][_0x42ecd8(0xeb)]===this['game']['getCountries']()[0x0][_0x42ecd8(0xeb)]){this.#countryObjects[_0x5d2072][_0x42ecd8(0x11a)][_0x42ecd8(0xff)][_0x42ecd8(0x100)](this.#redHexValue);let _0x10dae7=setInterval(()=>{const _0x1500dc=_0x42ecd8;this.#countryObjects[_0x5d2072][_0x1500dc(0x11a)][_0x1500dc(0xff)][_0x1500dc(0x11c)]()===this.#redHexValue?this.#countryObjects[_0x5d2072][_0x1500dc(0x11a)]['color'][_0x1500dc(0x100)](this.#lessWhiteHexValue):this.#countryObjects[_0x5d2072][_0x1500dc(0x11a)][_0x1500dc(0xff)][_0x1500dc(0x100)](this.#redHexValue);if(this.#countryObjects[_0x5d2072][_0x1500dc(0xbf)][_0x1500dc(0x10e)])this.#countryObjects[_0x5d2072]['material'][_0x1500dc(0xff)][_0x1500dc(0x100)](this.#blackHexValue),clearInterval(_0x10dae7);else this.#countryObjects[_0x5d2072][_0x1500dc(0xbf)][_0x1500dc(0xeb)]!==this[_0x1500dc(0x111)][_0x1500dc(0x12f)]()[0x0][_0x1500dc(0xeb)]&&(this.#countryObjects[_0x5d2072]['material'][_0x1500dc(0xff)][_0x1500dc(0x100)](this.#whiteHexValue),clearInterval(_0x10dae7));},0x1f4);break;}}}}}}),document['addEventListener'](_0x2df6b3(0xf9),_0x54baac=>{const _0x257cc4=_0x2df6b3,_0x5eda99=new Vector2(_0x54baac[_0x257cc4(0x141)]/window[_0x257cc4(0xb3)]*0x2-0x1,-_0x54baac[_0x257cc4(0xaa)]/window[_0x257cc4(0x10d)]*0x2+0x1),_0xf3b187=new Raycaster();_0xf3b187['setFromCamera'](_0x5eda99,this.#camera);const _0x42d6a5=_0xf3b187['intersectObjects'](this.#countryObjects);if(_0x42d6a5[_0x257cc4(0x115)]>0x0&&(_0x42d6a5[0x0][_0x257cc4(0x132)]['material']['color'][_0x257cc4(0x11c)]()===this.#redHexValue||_0x42d6a5[0x0][_0x257cc4(0x132)][_0x257cc4(0x11a)][_0x257cc4(0xff)][_0x257cc4(0x11c)]()===this.#lessWhiteHexValue)){document[_0x257cc4(0xb4)][_0x257cc4(0x123)][_0x257cc4(0x105)]='pointer';return;}_0x42d6a5[_0x257cc4(0x115)]>0x0&&!_0x42d6a5[0x0][_0x257cc4(0x132)]['userData'][_0x257cc4(0x10e)]?(_0x42d6a5[0x0][_0x257cc4(0x132)][_0x257cc4(0x11a)]['color']['setHex'](this.#blackHexValue),document[_0x257cc4(0xb4)][_0x257cc4(0x123)][_0x257cc4(0x105)]=_0x257cc4(0x10c)):(document[_0x257cc4(0xb4)][_0x257cc4(0x123)][_0x257cc4(0x105)]=_0x257cc4(0xfc),this.#countryObjects['forEach'](_0x3ce1eb=>{const _0x4daf21=_0x257cc4;!_0x3ce1eb['userData'][_0x4daf21(0x10e)]&&(_0x3ce1eb[_0x4daf21(0x11a)][_0x4daf21(0xff)][_0x4daf21(0x11c)]()===this.#blackHexValue&&_0x3ce1eb[_0x4daf21(0x11a)]['color'][_0x4daf21(0x100)](0xffffff));}));});}#showCorrectCountry(_0x481183){const _0x44b101=_0x4243a9;let _0x43eded=this.#calcPosFromLatLonRad(_0x481183['lat'],_0x481183['lon'],this[_0x44b101(0xfb)]);}#setDay(){const _0x1c9a92=_0x4243a9;let _0x2ed1ab=document[_0x1c9a92(0xee)](_0x1c9a92(0xe1));if(this.#animating)return;let _0x257b49=[0x0,0x1];if(!this.#daytime)_0x257b49=[0x1,0x0],window[_0x1c9a92(0xe5)][_0x1c9a92(0xd7)](_0x1c9a92(0xff),_0x1c9a92(0xe3));else{if(this.#daytime)_0x257b49=[0x0,0x1],window[_0x1c9a92(0xe5)][_0x1c9a92(0xd7)]('color',_0x1c9a92(0xc6));else return;}this.#animating=!![];let _0x13db3b={'t':0x0};_0x181d98({'targets':_0x13db3b,'t':_0x257b49,'complete':()=>{this.#animating=![],this.#daytime=!this.#daytime;},'update':()=>{const _0x4a82d1=_0x1c9a92;this.#sunLight[_0x4a82d1(0xba)]=0.1*(0x1-_0x13db3b['t']),this.#moonLight[_0x4a82d1(0xba)]=3.5*_0x13db3b['t'],this.#sunLight[_0x4a82d1(0x102)][_0x4a82d1(0xd9)](0x14*(0x1-_0x13db3b['t'])),this.#moonLight[_0x4a82d1(0x102)]['setY'](0x14*_0x13db3b['t']),this[_0x4a82d1(0xbe)]['material'][_0x4a82d1(0xe6)]=0x1-_0x13db3b['t'],this.#scene['children'][_0x4a82d1(0xc4)](_0x2c91e4=>{const _0x5767eb=_0x4a82d1;_0x2c91e4[_0x5767eb(0xea)](_0x5086bc=>{const _0x4f6600=_0x5767eb;_0x5086bc instanceof Mesh&&_0x5086bc[_0x4f6600(0x11a)][_0x4f6600(0xd0)]&&(_0x5086bc[_0x4f6600(0x11a)]['envMapIntensity']=_0x5086bc[_0x4f6600(0xb7)]*(0x1-_0x13db3b['t'])+_0x5086bc[_0x4f6600(0xcd)]*_0x13db3b['t']);});});},'easing':'easeInOutSine','duration':0x1f4}),window['localStorage'][_0x1c9a92(0xd7)]('dayTime',this.#daytime),window[_0x1c9a92(0xe5)][_0x1c9a92(0xd7)]('animating',this.#animating);}#loadDay(){const _0x2c3258=_0x4243a9;this.#daytime=JSON['parse'](window[_0x2c3258(0xe5)][_0x2c3258(0xf7)](_0x2c3258(0xe9))),this.#animating=!JSON[_0x2c3258(0xa9)](window[_0x2c3258(0xe5)][_0x2c3258(0xf7)]('animating')),document['getElementById'](_0x2c3258(0xe1))['click']();}async[_0x4243a9(0xd3)](){const _0xf31a04=_0x4243a9;this.#onWindowResize(),this.#setRayCasters(),this.#scene=new Scene(),this.#camera=new PerspectiveCamera(0x2d,innerWidth/ innerHeight,0.1,0x3e8),this.#camera[_0xf31a04(0x102)][_0xf31a04(0xa3)](0x0,0xf,0x32),this.#renderer=new WebGLRenderer({'antialias':!![],'alpha':!![]}),this.#renderer[_0xf31a04(0x133)](innerWidth,innerHeight),this.#renderer['toneMapping']=ACESFilmicToneMapping,this.#renderer[_0xf31a04(0x118)]=sRGBEncoding,this.#renderer['physicallyCorrectLights']=!![],this.#renderer[_0xf31a04(0x122)]['enabled']=!![],this.#renderer[_0xf31a04(0x122)][_0xf31a04(0xd8)]=PCFSoftShadowMap,document[_0xf31a04(0xb4)][_0xf31a04(0x10a)](this.#renderer[_0xf31a04(0x116)]),document['getElementsByTagName'](_0xf31a04(0xd1))[0x0]['style'][_0xf31a04(0xaf)]=_0xf31a04(0xc1),this.#sunLight=new DirectionalLight(new Color(_0xf31a04(0x107))[_0xf31a04(0xb2)](),3.5),this.#sunLight[_0xf31a04(0x102)][_0xf31a04(0xa3)](0xa,0x14,0xa),this.#sunLight[_0xf31a04(0x121)]=!![],this.#sunLight[_0xf31a04(0xec)][_0xf31a04(0xbc)][_0xf31a04(0x120)]=0x200,this.#sunLight[_0xf31a04(0xec)][_0xf31a04(0xbc)][_0xf31a04(0x137)]=0x200,this.#sunLight[_0xf31a04(0xec)]['camera'][_0xf31a04(0xf3)]=0.5,this.#sunLight[_0xf31a04(0xec)][_0xf31a04(0xa4)][_0xf31a04(0x131)]=0x64,this.#sunLight[_0xf31a04(0xec)][_0xf31a04(0xa4)][_0xf31a04(0x13d)]=-0xa,this.#sunLight[_0xf31a04(0xec)][_0xf31a04(0xa4)][_0xf31a04(0x13b)]=-0xa,this.#sunLight['shadow'][_0xf31a04(0xa4)][_0xf31a04(0xfa)]=0xa,this.#sunLight[_0xf31a04(0xec)]['camera']['right']=0xa,this.#sunLight[_0xf31a04(0xba)]=0.1,this.#scene[_0xf31a04(0xd6)](this.#sunLight),this.#moonLight=new DirectionalLight(new Color(_0xf31a04(0xca))[_0xf31a04(0xb2)](),0x0),this.#moonLight['position'][_0xf31a04(0xa3)](-0xa,0x14,0xa),this.#moonLight[_0xf31a04(0x121)]=!![],this.#moonLight[_0xf31a04(0xec)][_0xf31a04(0xbc)][_0xf31a04(0x120)]=0x200,this.#moonLight[_0xf31a04(0xec)][_0xf31a04(0xbc)][_0xf31a04(0x137)]=0x200,this.#moonLight['shadow'][_0xf31a04(0xa4)][_0xf31a04(0xf3)]=0.5,this.#moonLight[_0xf31a04(0xec)]['camera'][_0xf31a04(0x131)]=0x64,this.#moonLight['shadow'][_0xf31a04(0xa4)][_0xf31a04(0x13d)]=-0xa,this.#moonLight[_0xf31a04(0xec)][_0xf31a04(0xa4)][_0xf31a04(0x13b)]=-0xa,this.#moonLight[_0xf31a04(0xec)][_0xf31a04(0xa4)][_0xf31a04(0xfa)]=0xa,this.#moonLight[_0xf31a04(0xec)][_0xf31a04(0xa4)]['right']=0xa,this.#scene['add'](this.#moonLight);const _0x49a266=new AmbientLight('#77ccff',0x1);this.#scene[_0xf31a04(0xd6)](_0x49a266);const _0x148277=new PointLight(_0xf31a04(0xca),0x1);_0x148277[_0xf31a04(0x102)][_0xf31a04(0xa3)](0x5,0x3,0x5);const _0x369c2f=new OrbitControls(this.#camera,this.#renderer['domElement']);_0x369c2f['target'][_0xf31a04(0xa3)](0x0,0x0,0x0),_0x369c2f['dampingFactor']=0.05,_0x369c2f[_0xf31a04(0xcb)]=!![],_0x369c2f[_0xf31a04(0x13e)]=0xf,_0x369c2f[_0xf31a04(0x143)]=0x64;let _0x34485c=_0xf31a04(0x140),_0x28c849=new PMREMGenerator(this.#renderer),_0x2717d3=await new RGBELoader()[_0xf31a04(0x11d)](FloatType)[_0xf31a04(0x136)](_0xf31a04(0xd5)+_0x34485c),_0x364391=_0x28c849[_0xf31a04(0x125)](_0x2717d3)['texture'],_0x32314d={'bump':await new TextureLoader()[_0xf31a04(0x136)](_0xf31a04(0x106)),'map':await new TextureLoader()[_0xf31a04(0x136)](_0xf31a04(0x110)),'spec':await new TextureLoader()[_0xf31a04(0x136)](_0xf31a04(0xac)),'planeTrailMask':await new TextureLoader()[_0xf31a04(0x136)]('assets/textures/trail.png'),'cloud':await new TextureLoader()['load']('./assets/textures/earthCloud.png')};this[_0xf31a04(0xbe)]=new Mesh(new SphereGeometry(this[_0xf31a04(0xfb)],0x46,0x46),new MeshPhysicalMaterial({'map':_0x32314d[_0xf31a04(0x101)],'roughnessMap':_0x32314d[_0xf31a04(0xfd)],'bumpMap':_0x32314d[_0xf31a04(0xf2)],'bumpScale':0.05,'envMap':_0x364391,'envMapIntensity':0.4,'sheen':0x1,'sheenRoughness':0.75,'sheenColor':new Color(_0xf31a04(0xd4))[_0xf31a04(0xb2)](),'clearcoat':0.5})),this[_0xf31a04(0xbe)]['sunEnvIntensity']=0.4,this[_0xf31a04(0xbe)][_0xf31a04(0xcd)]=0.1,this['earth'][_0xf31a04(0x12b)]['y']+=Math['PI']*1.25,this[_0xf31a04(0xbe)][_0xf31a04(0xc5)]=!![],this[_0xf31a04(0xbe)][_0xf31a04(0xbf)][_0xf31a04(0xbe)]='earth',this.#countryObjects[_0xf31a04(0xcf)](this['earth']),this.#scene['add'](this[_0xf31a04(0xbe)]),await this[_0xf31a04(0xbd)](this[_0xf31a04(0x111)][_0xf31a04(0x12f)](),this[_0xf31a04(0x111)][_0xf31a04(0x142)]()),this.#setDay();const _0x244ca4=new SphereGeometry(10.2,0x46,0x8c),_0x1b78dc=new MeshPhongMaterial({'map':new TextureLoader()[_0xf31a04(0x114)](_0xf31a04(0xe2)),'transparent':!![]}),_0x42f098=new Mesh(_0x244ca4,_0x1b78dc);_0x42f098[_0xf31a04(0xb7)]=0.4,_0x42f098[_0xf31a04(0xcd)]=0.1,_0x42f098['rotation']['y']+=Math['PI']*1.25,_0x42f098[_0xf31a04(0xc5)]=!![],this.#scene[_0xf31a04(0xd6)](_0x42f098);const _0x591e26=new SphereGeometry(0x50,0x8c,0x8c),_0x15440d=new MeshBasicMaterial({'map':new TextureLoader()['load'](_0xf31a04(0xdd)),'side':_0xf1483f[_0xf31a04(0xb5)]}),_0x480d6a=new Mesh(_0x591e26,_0x15440d);this.#scene[_0xf31a04(0xd6)](_0x480d6a);const _0x56fb0b=new Scene(),_0x4f5549=new PerspectiveCamera(0x2d,innerWidth/ innerHeight,0.1,0x3e8);_0x4f5549[_0xf31a04(0x102)]['set'](0x0,0x0,0x32);const _0x4e01bb=new Mesh(new RingGeometry(0xf,13.5,0x50,0x1,0x0),new MeshPhysicalMaterial({'color':new Color('#FFCB8E')['convertSRGBToLinear']()[_0xf31a04(0x119)](0xc8),'roughness':0.25,'envMap':_0x364391,'envMapIntensity':1.8,'side':DoubleSide,'transparent':!![],'opacity':0.35}));_0x4e01bb[_0xf31a04(0xa6)]=_0xf31a04(0xc7),_0x4e01bb[_0xf31a04(0xe8)]=0.35,_0x4e01bb['moonOpacity']=0.03;const _0x1a7bbc=new Mesh(new RingGeometry(16.5,15.75,0x50,0x1,0x0),new MeshBasicMaterial({'color':new Color('#FFCB8E')[_0xf31a04(0xb2)](),'transparent':!![],'opacity':0.5,'side':DoubleSide}));_0x1a7bbc[_0xf31a04(0xa6)]=_0xf31a04(0xc7),_0x1a7bbc['sunOpacity']=0.35,_0x1a7bbc[_0xf31a04(0xb9)]=0.1;const _0x39c119=new Mesh(new RingGeometry(0x12,17.75,0x50),new MeshBasicMaterial({'color':new Color(_0xf31a04(0x126))['convertSRGBToLinear']()[_0xf31a04(0x119)](0x32),'transparent':!![],'opacity':0.5,'side':DoubleSide}));_0x39c119['name']=_0xf31a04(0xc7),_0x39c119['sunOpacity']=0.35,_0x39c119[_0xf31a04(0xb9)]=0.03;let _0x32be8d=(await new GLTFLoader()['loadAsync'](_0xf31a04(0xc2)))[_0xf31a04(0xa2)][_0xf31a04(0x124)][0x0],_0x12638e=[this.#makePlane(_0x32be8d,_0x32314d[_0xf31a04(0x127)],_0x364391,this.#scene),this.#makePlane(_0x32be8d,_0x32314d[_0xf31a04(0x127)],_0x364391,this.#scene),this.#makePlane(_0x32be8d,_0x32314d[_0xf31a04(0x127)],_0x364391,this.#scene),this.#makePlane(_0x32be8d,_0x32314d[_0xf31a04(0x127)],_0x364391,this.#scene),this.#makePlane(_0x32be8d,_0x32314d[_0xf31a04(0x127)],_0x364391,this.#scene)],_0x33cd4a=new Clock();this.#renderer['setAnimationLoop'](()=>{const _0x17e632=_0xf31a04;let _0x8484be=_0x33cd4a[_0x17e632(0x117)]();this[_0x17e632(0xbe)][_0x17e632(0x12b)]['y']+=_0x8484be*0.025,_0x42f098[_0x17e632(0x12b)]['y']+=_0x8484be*0.05,_0x480d6a[_0x17e632(0x12b)]['y']-=0.0002,_0x369c2f[_0x17e632(0xc0)](),this.#renderer[_0x17e632(0xa7)](this.#scene,this.#camera),_0x4e01bb[_0x17e632(0x12b)]['x']=_0x4e01bb[_0x17e632(0x12b)]['x']*0.95+this.#mousePos['y']*0.05*1.2,_0x4e01bb[_0x17e632(0x12b)]['y']=_0x4e01bb[_0x17e632(0x12b)]['y']*0.95+this.#mousePos['x']*0.05*1.2,_0x1a7bbc['rotation']['x']=_0x1a7bbc[_0x17e632(0x12b)]['x']*0.95+this.#mousePos['y']*0.05*0.375,_0x1a7bbc[_0x17e632(0x12b)]['y']=_0x1a7bbc[_0x17e632(0x12b)]['y']*0.95+this.#mousePos['x']*0.05*0.375,_0x39c119[_0x17e632(0x12b)]['x']=_0x39c119[_0x17e632(0x12b)]['x']*0.95-this.#mousePos['y']*0.05*0.275,_0x39c119[_0x17e632(0x12b)]['y']=_0x39c119[_0x17e632(0x12b)]['y']*0.95-this.#mousePos['x']*0.05*0.275,_0x12638e[_0x17e632(0xc4)](_0x3cf12d=>{const _0x338ad4=_0x17e632;let _0x8b087c=_0x3cf12d[_0x338ad4(0x12a)];_0x8b087c[_0x338ad4(0x102)][_0x338ad4(0xa3)](0x0,0x0,0x0),_0x8b087c[_0x338ad4(0x12b)][_0x338ad4(0xa3)](0x0,0x0,0x0),_0x8b087c[_0x338ad4(0x10b)](),_0x3cf12d[_0x338ad4(0x12c)]+=_0x8484be*0.25,_0x8b087c['rotateOnAxis'](_0x3cf12d[_0x338ad4(0x11e)],_0x3cf12d[_0x338ad4(0xa1)]),_0x8b087c[_0x338ad4(0xb0)](new Vector3(0x0,0x1,0x0),_0x3cf12d[_0x338ad4(0x12c)]),_0x8b087c[_0x338ad4(0xb0)](new Vector3(0x0,0x0,0x1),_0x3cf12d[_0x338ad4(0xdb)]),_0x8b087c[_0x338ad4(0x12d)](_0x3cf12d[_0x338ad4(0xad)]),_0x8b087c[_0x338ad4(0xb0)](new Vector3(0x1,0x0,0x0),+Math['PI']*0.5);}),this.#renderer[_0x17e632(0xc9)]=![],this.#renderer[_0x17e632(0xa7)](_0x56fb0b,_0x4f5549),this.#renderer[_0x17e632(0xc9)]=!![];});}#nr(){const _0x55ccdd=_0x4243a9;return Math[_0x55ccdd(0xa5)]()*0x2-0x1;}#makePlane(_0x535810,_0x3395bb,_0x22ad63,_0x47566c){const _0x45cf6b=_0x4243a9;let _0x1d5acc=_0x535810[_0x45cf6b(0xe7)]();_0x1d5acc[_0x45cf6b(0xd2)][_0x45cf6b(0xa3)](0.001,0.001,0.001),_0x1d5acc['position'][_0x45cf6b(0xa3)](0x0,0x0,0x0),_0x1d5acc['rotation'][_0x45cf6b(0xa3)](0x0,0x0,0x0),_0x1d5acc[_0x45cf6b(0x10b)](),_0x1d5acc[_0x45cf6b(0xea)](_0x27afbb=>{const _0x58e6c7=_0x45cf6b;_0x27afbb instanceof Mesh&&(_0x27afbb[_0x58e6c7(0x11a)][_0x58e6c7(0xd0)]=_0x22ad63,_0x27afbb['sunEnvIntensity']=0x1,_0x27afbb['moonEnvIntensity']=0.3,_0x27afbb[_0x58e6c7(0x121)]=!![],_0x27afbb['receiveShadow']=!![]);});let _0x516d92=new Mesh(new PlaneGeometry(0x1,0x2),new MeshPhysicalMaterial({'envMap':_0x22ad63,'envMapIntensity':0x3,'roughness':0.4,'metalness':0x0,'transmission':0x1,'transparent':!![],'opacity':0x1,'alphaMap':_0x3395bb}));_0x516d92[_0x45cf6b(0xb7)]=0x3,_0x516d92['moonEnvIntensity']=0.7,_0x516d92['rotateX'](Math['PI']),_0x516d92[_0x45cf6b(0x12d)](1.1);let _0x1ae55d=new Group();return _0x1ae55d[_0x45cf6b(0xd6)](_0x1d5acc),_0x1ae55d[_0x45cf6b(0xd6)](_0x516d92),_0x47566c[_0x45cf6b(0xd6)](_0x1ae55d),{'group':_0x1ae55d,'yOff':10.5+Math[_0x45cf6b(0xa5)]()*0x1,'rot':Math['PI']*0x2,'rad':Math[_0x45cf6b(0xa5)]()*Math['PI']*0.45+Math['PI']*0.05,'randomAxis':new Vector3(this.#nr(),this.#nr(),this.#nr())[_0x45cf6b(0xf1)](),'randomAxisRot':Math['random']()*Math['PI']*0x2};}#onWindowResize(){const _0x33e5f8=_0x4243a9;window[_0x33e5f8(0x128)]('resize',()=>{const _0x3fe4f4=_0x33e5f8;this.#camera[_0x3fe4f4(0x104)]=window[_0x3fe4f4(0xb3)]/window['innerHeight'],this.#camera['updateProjectionMatrix'](),this.#renderer[_0x3fe4f4(0x108)](window[_0x3fe4f4(0xdc)]),this.#renderer[_0x3fe4f4(0x133)](window[_0x3fe4f4(0xb3)],window[_0x3fe4f4(0x10d)]);});}}