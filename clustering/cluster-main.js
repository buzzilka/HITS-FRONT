import { cluster } from "./k-means.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const points = [];
let clusterCount = 3;
let selectedColor = '#000000';

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x: x, y: y, color: selectedColor });
    drawPoints();
});

function drawPoints() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    points.forEach(point => {
        ctx.beginPath();
        ctx.fillStyle = point.color;
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function getClusterNums(){
    var num = document.getElementById('clusterNums').value;
    clusterCount = parseInt(num);
}

function startAlg(){
    if (clusterCount <= points.length) {
        cluster(clusterCount, points, canvas, ctx);
    } else {
        alert('Введите корректное количество кластеров!');
    }
}

function clearCanvas() {
    points.length = 0;
    ctx.clearRect(0,0,canvas.width, canvas.height);
}

window.clearCanvas = clearCanvas;
window.getClusterNums = getClusterNums;
window.startAlg = startAlg;