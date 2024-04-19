const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

import { kMeans } from "./k-means.js";
import { fCMeans } from "./c-means.js";
import { hierarchical } from "./hierarchical.js";

document.getElementById('rangeValueK').textContent = "Количество кластеров(K-Means): 3";
document.getElementById('rangeValueC').textContent = "Количество кластеров(C-Means): 3";
document.getElementById('rangeValueHierarchical').textContent = "Количество кластеров(Hierarchical): 3";

let clusterCountKMeans = 3;
let clusterCountCMeans = 3;
let clusterCountHierarchical = 3;
let fuzzyNum = 2;
let maxIterations = 500;

const colors = [
    'red',
    'blue',
    'lime',
    'pink',
    'yellow',
    'purple',
    'orangered',
    'mediumspringgreen',
    'khaki',
    'indigo'
];

document.getElementById("rangeKMeans").addEventListener("change", function() {
    clusterCountKMeans = this.value;
    document.getElementById('rangeValueK').textContent = "Количество кластеров(K-Means): " + document.getElementById('rangeKMeans').value;
});

document.getElementById("rangeCMeans").addEventListener("change", function() {
    clusterCountCMeans = this.value;
    document.getElementById('rangeValueC').textContent = "Количество кластеров(C-Means): " + document.getElementById('rangeCMeans').value;
});

document.getElementById("rangeHierarchical").addEventListener("change", function() {
    clusterCountHierarchical = this.value;
    document.getElementById('rangeValueHierarchical').textContent = "Количество кластеров(Hierarchical): " + document.getElementById('rangeHierarchical').value;
});

function startAlgs() {
    fCMeans(points, ctx, clusterCountCMeans, fuzzyNum, maxIterations,colors);
    kMeans(points, ctx, clusterCountKMeans, colors);
    hierarchical(points,ctx,clusterCountHierarchical,colors);
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