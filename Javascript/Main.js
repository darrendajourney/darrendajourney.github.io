window.onload = function() {
const canvas = document.getElementById("renderCanvas");
        let startRenderLoop = function (engine, canvas) {
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        }

    
        let createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
        const createScene = async function () {
        
            const scene = new BABYLON.Scene(engine);

            const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3(0, 0, 0));
            camera.attachControl(canvas, true);

            scene.clearColor = new BABYLON.Color3(0, 0, 0);

            BABYLON.Engine.audioEngine.setGlobalVolume(1);

            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-10, 30, 0), scene);
            light.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
            light.intensity = 0.8;


            //creating the ground
            const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", "Textures/Face.JPG", {width:30, height :30, subdivisions: 60, maxHeight: 0.3});
            ground.position.y -= 2.5;
            ground.position.z += 3;

            const groundmaterial = new BABYLON.StandardMaterial('mat', scene);
            groundmaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
            groundmaterial.diffuseTexture = new BABYLON.Texture("Textures/Face.JPG", scene);
            groundmaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            ground.material = groundmaterial;

            

            //creating a stop box button for the audio
            const stopBox = BABYLON.MeshBuilder.CreateBox("stopbox", {size: 1, height: 1, width: 1, depth: 0.5});
            //material for the stopbox
            stopBox.position.x += 1;
            stopBox.position.y -= 1;
            stopBox.position.z += 2;
            //creating material for stopbox
            const boxMaterial = new BABYLON.StandardMaterial("boxmat", scene);
            boxMaterial.diffuseColor = new BABYLON.Color3(1 ,0 ,0);
            boxMaterial.alpha = 0.6;
            stopBox.material = boxMaterial;

            //creating a play polyhedron for the audio
            const playPoly = BABYLON.MeshBuilder.CreatePolyhedron("playpolly", {type: 0, size: 0.1, sizeX: 0.5, sizeY: 0.5, sizeZ: 0.2});
            playPoly.position.x -= 1;
            playPoly.position.y -= 1;
            playPoly.position.z += 2;
            //creating material for polly
            //const pollyMaterial = new BABYLON.StandardMaterial("pollymat", scene);
            const pbrPollyMat = new BABYLON.PBRMaterial("pbrmat", scene);
            playPoly.material = pbrPollyMat;
            pbrPollyMat.albedoColor = new BABYLON.Color3(0, 1, 0);

            pbrPollyMat.metallic = 0.5;
            pbrPollyMat.roughness = 0.1;
            pbrPollyMat.alpha = 0.8;
            pbrPollyMat.subSurface.isRefractionEnables = true;


            let radialSegments = Math.floor(Math.random() * 800 + 100);
            let p = Math.floor(Math.random() * 160 + 100);
            //creating a tour knot
            const torus_knot = BABYLON.MeshBuilder.CreateTorusKnot("torusknot", {radius: 1, tube: 0.07, radialSegments, 
                p, q: -165, updatable: true});           
                
            //material for the torus using 
            let material = new BABYLON.StandardMaterial("material", scene);
            material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            material.alpha = 0.4;
            torus_knot.material = material;
            
            //position of torus on z 
            torus_knot.position.z += 4;
           

            //rotating the torus on the y axis using a vextor 3 and rotating in world space
            let axis = new BABYLON.Vector3(0, 0.1, 0);
            //speed of rotation
            let angle = 0.02;
            //function to animate the torus
            scene.registerAfterRender(function() {
                torus_knot.rotate(axis, angle, BABYLON.Space.WORLD);

            //creating a basic shader for the torusknot
        let toruscolors = torus_knot.getVerticesData(BABYLON.VertexBuffer.ColorKind);
        if(!toruscolors) {
            toruscolors = [];

            let positions = torus_knot.getVerticesData(BABYLON.VertexBuffer.PositionKind);

            for(let p = 0; p < positions.length / 2; p++) {
                toruscolors.push(Math.random(), Math.random(), Math.random());
            }
        }
            
            torus_knot.setVerticesData(BABYLON.VertexBuffer.ColorKind, toruscolors);
            
              
            });

            //loading the sound track
            sounds = new BABYLON.Sound("mainmenu", "./Sounds/MainMenu.wav", scene, null, {
                spatialSound: true,
                distanceModel: "linear",
                maxDistance: 30,
            });
            sounds.attachToMesh(torus_knot);

              //making the playpolly clickable to play some music
              playPoly.actionManager = new BABYLON.ActionManager(scene);
              //registering the action manager
              playPoly.actionManager.registerAction(
                  new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickTrigger,
  
                  sounds
                      ));
  
              stopBox.actionManager = new BABYLON.ActionManager(scene);
              //registering the action manager
              stopBox.actionManager.registerAction(
                  new BABYLON.StopSoundAction(BABYLON.ActionManager.OnPickTrigger,
          
                  sounds
                      ));  
            
            //creating an audio analyser
            const musicAnalyser = new BABYLON.Analyser(scene);
            BABYLON.Engine.audioEngine.connectToAnalyser(musicAnalyser);
            //musicAnalyser.drawDebugCanvas();
            musicAnalyser.FFT_SIZE = 32;
	        musicAnalyser.SMOOTHING = 0.3;

            let musicFrequency = musicAnalyser.getByteFrequencyData();
            let binCount = musicAnalyser.getFrequencyBinCount;

            for (let i = 0; i < musicFrequency.length; i++){
                let v = binCount[i] /= Math.pow(10, 4);
                    v = material.diffuseColor;
                }

            setInterval(shape, 5000);
                function shape(){
                    material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
                    material.alpha = Math.random() * 0.8 + 0.1;
                }

        //creating a AR session
            //const xr = await scene.createDefaultXRExperienceAsync({
                //uiOptions: {
                    //sessionMode: 'immersive-ar',
                    ///referenceSpaceType: "local-floor"   
                //},
                //optionalFeatures: true,
            //});

            //const fm = xr.baseExperience.featuresManager;
            //const anchorSystem = fm.enableFeature(BABYLON.WebXRAnchorSystem, "latest");
            //anchorSystem.onAnchorAddedObservable.add((anchor) => {
                //anchor.attachedNode = torus_knot;
            //anchorSystem.onAnchorUpdatedObservable.add((anchor) => {
                //anchor.attachedNode = torus_knot;
            //})
              //});

            return scene;
        };
       
                window.initFunction = async function() {
                    
                    
                    var asyncEngineCreation = async function() {
                        try {
                        return createDefaultEngine();
                        } catch(e) {
                        console.log("the available createEngine function failed. Creating the default engine instead");
                        return createDefaultEngine();
                        }
                    }

                    window.engine = await asyncEngineCreation();
        if (!engine) throw 'engine should not be null.';
        startRenderLoop(engine, canvas);
        window.scene = createScene();};
        initFunction().then(() => {scene.then(returnedScene => { sceneToRender = returnedScene; });
                            
        });

         //Resize
        window.addEventListener("resize", function () {
            engine.resize();
            
        });
    }

   