//setting up web audio api for sounds to use paly and filter events 
const audiocontext = new AudioContext();
audiocontext.resume();

//this sound is playing on a loop for the sound bed
const music = new Audio("./websounds/BackAtmos2.wav");

//loading the sounds for static sounds 
const static = new Audio("./websounds/staticsea.wav");

const music1 = new Audio("./websounds/BackAtmos1.wav");

//setting up the audio player 
const source1 = audiocontext.createMediaElementSource(static);
const source = audiocontext.createMediaElementSource(music);
 //setting up global volume
 const volume = audiocontext.createGain();
 volume.gain.value = 0.6;

function play() {
music.loop = true;
music.play();

setInterval(staticDelay, 19622);
static.loop = true; 
static.play();

music1.loop = true;
music1.play();

}

function stop(){
music.pause();

static.pause();
clearInterval(staticDelay);

music1.pause();


}


//creating a low pass filter for the static sea sound
const filter = audiocontext.createBiquadFilter();
filter.type = "lowpass";

function staticDelay() {
filter.frequency.setValueAtTime (Math.random() * 500 + 200, audiocontext.currentTime)
};

//creating an audio analyser 
const analyser = audiocontext.createAnalyser();
analyser.fftSize = 64;

const binCount = new Uint8Array(analyser.frequencyBinCount);
console.log(binCount);

analyser.getByteFrequencyData(binCount);
    
//connecting the source and volume to the destination
source.connect(analyser);
analyser.connect(volume);
source1.connect(filter);
filter.connect(volume);
volume.connect(audiocontext.destination);











