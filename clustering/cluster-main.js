const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

import { kMeans } from "./k-means.js";
import { fCMeans } from "./c-means.js";

document.getElementById('rangeValueK').textContent = "Количество кластеров(K-Means): 3";
document.getElementById('rangeValueC').textContent = "Количество кластеров(C-Means): 3";

let clusterCountKMeans = 3;
let clusterCountCMeans = 3;
let fuzzyNum = 2;
let maxIterations = 100;

document.getElementById("rangeKMeans").addEventListener("change", function() {
    clusterCountKMeans = this.value;
    document.getElementById('rangeValueK').textContent = "Количество кластеров(K-Means): " + document.getElementById('rangeKMeans').value;
});

document.getElementById("rangeCMeans").addEventListener("change", function() {
    clusterCountCMeans = this.value;
    document.getElementById('rangeValueC').textContent = "Количество кластеров(C-Means): " + document.getElementById('rangeCMeans').value;
});

function startAlgs(){
    fCMeans(points,ctx,clusterCountCMeans,fuzzyNum,maxIterations);
    kMeans(clusterCountKMeans,points,ctx);
}

const points = [];

function drawPoint(ctx, x, y, radius = 5, color = 'white') {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x: x, y: y});
    drawPoint(ctx, x, y);
});

buttonClear.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.length = 0;
})

window.startAlgs = startAlgs;