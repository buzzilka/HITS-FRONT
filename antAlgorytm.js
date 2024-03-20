const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = "14px serif";
const points = [];


canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.push({ x, y });

    drawPoints();
    joinPoints();
    drawDistance();
});

function drawDistance() {
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++)
        {
            const first = points[i];
            const second = points[j];

            const distance = calcDistance(first, second);
            const center = findCenter(first, second);

            ctx.fillStyle = 'blue';
            ctx.fillText(distance.toFixed(0), center.x, center.y);
        }
    }
}

function findCenter(first, second) {
    return { x: (first.x + second.x)/2, y: (first.y + second.y)/2};
}

function calcDistance(first, second) {
    return Math.hypot(first.x - second.x, first.y - second.y);
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function joinPoints() {
    ctx.beginPath();
    for(let i = 0; i < points.length; i++)
    {
        for(let j = 0; j < points.length; j++)
        {
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
        }
    }
}

document.getElementById('second').onclick = clear;

function clear() {
    points.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('third').onclick = toBack;

function toBack() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.length--;
    drawPoints();
    joinPoints();
    drawDistance();
}

function antAlgorythm()
{

}

document.getElementById('first').onclick = start;

function start() {
    antAlgorythm();
}