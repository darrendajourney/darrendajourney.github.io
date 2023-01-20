function sound() {
    const audiocontext = new AudioContext();
    audiocontext.resume();

    const listener = audiocontext.listener
    
    //creating the first tone as a triangle wave form
    const tone1 = audiocontext.createOscillator();
    tone1.type = "triangle";
    tone1.frequency.setValueAtTime(Math.floor(Math.random() *200) + 90, audiocontext.currentTime);
    tone1.start(0);
    tone1.stop(0.35);

    //creating the second tone as a square wave form
    const tone2 = audiocontext.createOscillator();
    tone2.type = "square";
    tone2.frequency.setValueAtTime(Math.floor(Math.random() * 140) + 80, audiocontext.currentTime);
    tone2.start(0);
    tone2.stop(0.35);

    //creating a second gain to control the square volume
    const tone2vol = audiocontext.createGain();
    tone2vol.gain.value = 0.1;

    //creating the overall volume
    const volume = audiocontext.createGain();
    volume.gain.value = 0.15;
    volume.gain.setTargetAtTime(0, 0.10, 0.40)

    //connecting all the nodes together 
    tone1.connect(tone2vol);
    tone2.connect(volume);
    tone2vol.connect(volume);
    volume.connect(audiocontext.destination);
}

