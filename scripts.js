'use strict';
import { stellarBase64 } from './stellar-escape.js';

const audio1 = document.getElementById('audio1');
const blueSlider = document.getElementById('blueSlider');
const canvas = document.getElementById('canvas1');
const container = document.getElementById('container');
const greenSlider = document.getElementById('greenSlider');
const heightSlider = document.getElementById('heightSlider');
const redSlider = document.getElementById('redSlider');
const clickMe = document.getElementById('clickMe');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', function () {
  if (!audio1.paused) {
    clickMe.style.display = 'block';
    clickMe.innerHTML = 'Play';
  } else {
    clickMe.innerHTML = 'Pause';
  }
});

container.addEventListener('click', function () {
  if (audio1.paused) {
    audio1.play();
    audio1.src = `data:audio/wav;base64,${stellarBase64}`;
    const audioContext = new AudioContext();
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
      drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
      requestAnimationFrame(animate);
    }
    animate();
  } else {
    audio1.pause();
  }
});

const drawVisualiser = (bufferLength, x, barWidth, barHeight, dataArray) => {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = heightSlider.value * dataArray[i] + 100;
    const red = redSlider.value;
    const green = greenSlider.value;
    const blue = blueSlider.value;
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth;
  }
};

// music credit
// Music from #Uppbeat (free for Creators!):
// https://uppbeat.io/t/prigida/stellar-escape
// License code: YYPWTIESUCPZVM6Y
