//https://www.youtube.com/watch?v=GNcGPw_Kb_0&t=798s&ab_channel=Onigiri
//исходный код на Java

import { nnMain } from './network.js'
import { biases } from './nn/biases.js'
import { weights } from './nn/weights.js'
import { neurons } from './nn/neurons.js'
 
let nnetwork;

let brushSize = 3;

let imgParametrs = 50;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
 
const buttonStart = document.getElementById("buttonStart");
const buttonClear = document.getElementById("buttonClear");
 
 
document.addEventListener("DOMContentLoaded", function () {
    nnetwork = nnMain(biases, weights);
})

buttonStart.addEventListener('click', function () {
    neuralNetwork()
});
 
buttonClear.addEventListener('click', function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("answerPlace").textContent = "";
})
 
let isDraw = false;
let lastX = 0;
let lastY = 0;
 
canvas.addEventListener('mousedown', function(){
    isDraw = true;
    const rect = canvas.getBoundingClientRect();
    lastX = Math.floor((event.clientX - rect.left) / (rect.width / canvas.width));
    lastY = Math.floor((event.clientY - rect.top) / (rect.height / canvas.height));
    drawPoint(lastX, lastY);
});

canvas.addEventListener('mousemove', function(event){
    if (isDraw) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / (rect.width / canvas.width));
        const y = Math.floor((event.clientY - rect.top) / (rect.height / canvas.height));
        drawLine(lastX, lastY, x, y);
        lastX = x;
        lastY = y;
    }
});

canvas.addEventListener('mouseup', function(){
    isDraw = false;
});

canvas.addEventListener('mouseout', function(){
    isDraw = false;
});
 
function drawPoint(x, y) {
    context.fillStyle = 'white';
    context.fillRect(x, y, brushSize, brushSize);
}
 
function drawLine(x1, y1, x2, y2) {
    context.fillStyle = 'white';
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
        drawPoint(x1, y1);
        if (x1 === x2 && y1 === y2) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x1 += sx; }
        if (e2 < dx) { err += dx; y1 += sy; }
    }
}

//https://stackoverflow.com/questions/39619967/js-center-image-inside-canvas-element
//помоголо
function imageCenterig(imgData, image) {
    let test = new Array(imgParametrs * imgParametrs); 
        for (let i = 3; i < imgData.length; i += 4) {
            test[ Math.floor(i / 4) ] = (imgData[i] / 255);
        }

        let top = cropByY(true, test); let bottom= cropByY(false, test);
        let left = cropByX(true, test); let right = cropByX(false, test);

        let centeringLR = right - left;
        let centeringTB = bottom- top;

        canvas.width = 50;
        canvas.height = 50;

        let size = Math.floor(Math.max(centeringLR, centeringTB) * 0.3) * 2 + Math.max(centeringLR, centeringTB);
        let gorizontal = Math.floor((size - centeringLR) / 2);
        let vertical = Math.floor((size - centeringTB) / 2);

        context.drawImage(image, left - gorizontal, top - vertical, centeringLR + (gorizontal * 2), centeringTB + (vertical * 2), 0, 0, 50, 50);
        return context.getImageData(0, 0, 50, 50).data;
}

function neuralNetwork() {
    let image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        var imgData = context.getImageData(0, 0, imgParametrs, imgParametrs).data;
        let scaledImage = imageCenterig(imgData, image);

        let userImage = new Array(imgParametrs** 2);
        for (let i = 3; i < scaledImage.length; i += 4) {
            userImage[ Math.floor(i / 4) ] = (scaledImage[i] / 255);
        }

        const output = nnetwork.feedForward(userImage);
        console.log(output);
        let endDigit = 0;
        let endDigitWeight = -1;
 
        for (let i = 0; i < 10; i++) {
            if (endDigitWeight < output[i]) {
                endDigitWeight = output[i];
                endDigit = i;
            }
        }
 
        document.getElementById('answerPlace').textContent = "" + endDigit;
    }
}

function cropByX(fromLeft, imgData) {
    var offset;
    if (fromLeft) {
        offset = 1;
    } else {
        offset = -1;
    }

    var result = null;
    if (fromLeft) {
        for (var x = 0; x < imgParametrs; x += offset) {
            for (var y = 0; y < imgParametrs; y += 4) {
                let index = (y * imgParametrs) + x;
                if (imgData[index] !== 0) {
                    result = x;
                    break;
                }
            }
            if (result !== null) {
                break;
            }
        }
    } else {
        for (x = imgParametrs - 1; x > -1; x += offset) {
            for (var y = 0; y < imgParametrs; y += 4) {
                let index = (y * imgParametrs) + x;
                if (imgData[index] !== 0) {
                    result = Math.min(x + 1, imgParametrs);
                    break;
                }
            }
            if (result !== null) {
                break;
            }
        }
    }

    return result;
};

function cropByY(fromTop, imgData) {
    var offset;
    if (fromTop) {
        offset = 1;
    } else {
        offset = -1;
    }

    var result = null;
    if (fromTop) {
        for (var y = 0; y < imgParametrs; y += offset) {
            for (var x = 0; x < imgParametrs; x++) {
                let index = (y * imgParametrs) + x;
                if (imgData[index] != 0) {
                    return y;
                }
            }
        }
    } else {
        for (var y = imgParametrs - 1; y > -1; y += offset) {
            for (var x = 0; x < imgParametrs; x++) {
                let index = (y * imgParametrs) + x;
                if (imgData[index] != 0) {
                    return Math.min(y + 1, imgParametrs);
                }
            }
        }
    }

    return result;
 }