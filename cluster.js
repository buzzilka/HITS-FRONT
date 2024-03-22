const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const points = [];
let selectedColor = '#000000';

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

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

function cluster() {

}

document.getElementById('colorPicker').addEventListener('change', function() {
 selectedColor = this.value;
});