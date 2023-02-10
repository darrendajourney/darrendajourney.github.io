//setting up web audio api for sounds to use paly and filter events 
const audiocontext = new AudioContext();
audiocontext.resume();

//this sound is playing on a loop for the sound bed
const music = new Audio("./websounds/BackAtmos2.wav");

//loading the sounds for static sounds 
const static = new Audio("./websounds/Sea02.wav");
const music1 = new Audio("./websounds/BackgroundTone.wav");

//setting up the audio player 
const source1 = audiocontext.createMediaElementSource(static);
const source = audiocontext.createMediaElementSource(music);
const source2 = audiocontext.createMediaElementSource(music1);
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
filter.frequency.setValueAtTime (Math.random() * 800 + 300, audiocontext.currentTime)
};
    
//creating an audio analyser 
const analyser = audiocontext.createAnalyser();
//the fft size will be halfed and used by the array
analyser.fftSize = 64;
const binCount = analyser.frequencyBinCount;
console.log(binCount);
const dataArray = new Uint8Array(binCount);
console.log(dataArray)

//connecting the source and volume to the destination
source.connect(analyser);
analyser.connect(volume);
source1.connect(filter);
filter.connect(volume);
source2.connect(volume);
volume.connect(audiocontext.destination);











