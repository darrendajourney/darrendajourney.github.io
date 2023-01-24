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

            const camera = new BABYLON.ArcRotateCamera("Camera", -1.5708, 1.5708, 3, new BABYLON.Vector3(0, 0, 0), scene);
           
        
            //sets the max and min zoom distance
            camera.lowerRadiusLimit = 2;
            camera.upperRadiusLimit = 10;
            camera.attachControl(canvas, true);

            scene.clearColor = new BABYLON.Color3(0, 0, 0);

            BABYLON.Engine.audioEngine.setGlobalVolume(1);

            BABYLON.SceneLoader.ImportMesh(["metalSpeaker"], "mesh/", "Speaker.gltf", scene, function (mesh) {
                camera.target = mesh[0];
                mesh[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
                mesh[0].position.z += 1.9;
                //mesh[0].position.y -= 1;
            })

           

            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(10, 30, -40), scene);
            light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
            light.intensity = 0.8;

            const light1 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(-10, -20, 40), scene);
            light1.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
            light1.intensity = 0.4;

            let gl = new BABYLON.GlowLayer("glow", scene);
            gl.intensity = 0.4;

            //creating a sphere for the sound and hidding it with opacity
            const midSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {segments: 10, diameter: 0.9}, scene);

            setInterval(colourChange, 5000);
            function colourChange() {
            //creating a material for the sphere
            const spheremat = new BABYLON.StandardMaterial("spheremat", scene);
            spheremat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            spheremat.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            spheremat.alpha = Math.random() * 1 + 0.1;
            midSphere.material = spheremat;
            }

            //sphere position
            midSphere.position.y += 0.8;
           midSphere.position.z += 2;

            //creating a stop box button for the audio
            const stopBox = BABYLON.MeshBuilder.CreateBox("stopbox", {size: 0.5, height: 0.5, width: 0.5, depth: 0.2});
            
            //material for the stopbox
            stopBox.position.x += 1;
            stopBox.position.y -= 0;
            stopBox.position.z += 1.5;

            //creating material for stopbox
            const boxMaterial = new BABYLON.StandardMaterial("boxmat", scene);
            boxMaterial.diffuseColor = new BABYLON.Color3(1 ,0 ,0);
            stopBox.material = boxMaterial;

            //creating a play polyhedron for the audio
            const playPoly = BABYLON.MeshBuilder.CreatePolyhedron("playpolly", {type: 0, size: 0.1, sizeX: 0.3, sizeY: 0.3, sizeZ: 0.1});
            playPoly.position.x -= 1;
            playPoly.position.y -= 0;
            playPoly.position.z += 1.5;

            //creating material for polly
            //const pollyMaterial = new BABYLON.StandardMaterial("pollymat", scene);
            const pbrPollyMat = new BABYLON.PBRMaterial("pbrmat", scene);
            playPoly.material = pbrPollyMat;
            pbrPollyMat.albedoColor = new BABYLON.Color3(0, 1, 0);

            pbrPollyMat.metallic = 0.9;
            pbrPollyMat.roughness = 0.1;
            pbrPollyMat.subSurface.isRefractionEnables = true;
            
            const SPS = new BABYLON.SolidParticleSystem("SPS", scene);
            const sphere = BABYLON.MeshBuilder.CreateSphere("s", {});
            SPS.addShape(sphere, 60); // 20 spheres
            sphere.dispose(); //dispose of original model sphere
        
            const mesh = SPS.buildMesh(); // finally builds and displays the SPS mesh
            
            // initiate particles function
            SPS.initParticles = () => {
                for (let p = 0; p < SPS.nbParticles; p++) {
                    const particle = SPS.particles[p];
                    particle.position.x = BABYLON.Scalar.RandomRange(-10, 10);
                    particle.position.y = BABYLON.Scalar.RandomRange(-10, 10);
                    particle.position.z = BABYLON.Scalar.RandomRange(-10, 10);
                    particle.color = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
                    particle.scaling.x = 0.5;
                    particle.scaling.y = 0.5;
                    particle.scaling.z = 0.5;
                }
            };
        
            //Update SPS mesh
            SPS.initParticles();
            SPS.setParticles();

            let axis = new BABYLON.Vector3(0, 1, 0);
            let axisRev = new BABYLON.Vector3(0, -1, 0);
            let angle = 0.01;
            let angle1 = 0.001;
            scene.registerBeforeRender(function() {
                midSphere.rotate(axis, angle, BABYLON.Space.WORLD);
                mesh.rotate(axisRev, angle1, BABYLON.Space.WORLD);
            })

                //creating a basic shader for the particles
                let toruscolors = midSphere.getVerticesData(BABYLON.VertexBuffer.ColorKind);
                if(!toruscolors) {
                toruscolors = [];
    
                let positions = midSphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    
                for(let p = 0; p < positions.length / 2; p++) {
                    toruscolors.push(Math.random(), Math.random(), Math.random());
                }
            
                
                midSphere.setVerticesData(BABYLON.VertexBuffer.ColorKind, toruscolors);
        }
        

            //loading the sound track
            sounds = new BABYLON.Sound("mainmenu", "./Sounds/MainMenu.wav", scene, null, {
                spatialSound: true,
                distanceModel: "linear",
                maxDistance: 10,
            });
            sounds.attachToMesh(midSphere);

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
        //const musicAnalyser = new BABYLON.Analyser(scene);
        //BABYLON.Engine.audioEngine.connectToAnalyser(musicAnalyser);
        //musicAnalyser.drawDebugCanvas();
        //musicAnalyser.FFT_SIZE = 32;
	    //musicAnalyser.SMOOTHING = 0.3;

        //let musicFrequency = musicAnalyser.getByteFrequencyData();
        //let binCount = musicAnalyser.getFrequencyBinCount;

        //for (let i = 0; i < musicFrequency.length; i++){
            //let v = binCount[i] /= Math.pow(10, 4) ;
            //spheremat.emissiveColor = v
            //console.log(v);
            //}
            

        //creating a AR session
        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: 'immersive-ar',
                referenceSpaceType: "local-floor"
        },
        optionalFeatures: true,});

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

   