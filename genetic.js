const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const points = [];

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.push({ x, y });

    drawPoints();
    soed();
});

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function soed() {
    ctx.beginPath();
    for(let i = 0; i < points.length; i++)
    {
        for(let j = 0; j < points.length; j++)
        {
            ctx.moveTo(points[i].x, points[i].y);
            points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
        }
    }
}