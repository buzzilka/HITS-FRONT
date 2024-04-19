const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const points = [];
const pheromone = 1;
const forPath = 1500;
const forPheromones = 1000;
const evaporation = 0.5;
const alfa = 2;
const beta = 20;
let allPaths = [];
let bestPath = [];
let countOfIteration;
let matrix = [];

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.push({x, y});

    drawPoints();
});

function getCountIteration() {
    let num = document.getElementById('iteration_count').value;
    countOfIteration = parseInt(num);
}

function calcDistance(first, second) {
    return Math.hypot(first.x - second.x, first.y - second.y);
}

function sumDistance(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        sum += calcDistance(points[arr[i]], points[arr[i + 1]]);
    }
    return sum;
}

function drawPoints() {
    ctx.fillStyle = 'MediumOrchid';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawPath(color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let j = 0; j < bestPath.length - 1; j++) {
        ctx.moveTo(points[bestPath[j]].x, points[bestPath[j]].y);
        ctx.lineTo(points[bestPath[j + 1]].x, points[bestPath[j + 1]].y);
        ctx.stroke();
    }
    drawPoints();
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
}

function getMatrix() {
    matrix = [];
    for(let i = 0; i < points.length; i++) {
        matrix[i] = [];
        for(let j = 0; j < points.length; j++) {
            if(i === j) {
                matrix[i][j] = {distanceLength: 0, pheromones: 0, closeness: 0};
            }
            else {
                let distance = calcDistance(points[i], points[j]);
                matrix[i][j] = {distanceLength: distance, pheromones: pheromone, closeness: forPath/distance};
            }
        }
    }
}

function calcWishes(antWish) {
    let sum = 0;
    for(let i = 0; i < antWish.length; i++) {
        sum += antWish[i];
    }
    return sum;
}

function calcProbability(visited, path) {
    let probability = [];
    let antWish = [];

    for(let i = 0; i < path.length; i++) {
        if(!(visited.includes(i)) && path[i] !== 0) {
            antWish[i] =  Math.pow(path[i].pheromones, alfa) * Math.pow(path[i].closeness, beta);
        }
        else {
            antWish[i] = 0;
        }
    }

    for(let i = 0; i < antWish.length; i++) {
        if(calcWishes(antWish) !== 0) {
            probability[i] = antWish[i]/calcWishes(antWish);
        }
        else {
            probability[i] = 0;
        }
    }
    return probability;
}

function select(visited, probabilities) {
    let countOfProbability;
    let range = [];

    for(let i = 0; i < probabilities.length; i++) {
        if(!(visited.includes(i))) {
            countOfProbability = Math.round(probabilities[i] * 100);
            for(let j = 0; j < countOfProbability; j++) {
                range.push(i);
            }
        }
    }

    let selectedPoint = Math.floor(Math.random() * range.length);
    return range[selectedPoint];
}

function updateOfPheromones(visited) {
    for(let i = 0; i < visited.length - 1; i++) {
        matrix[visited[i]][visited[i + 1]].pheromones = (matrix[visited[i]][visited[i + 1]].pheromones * evaporation) + 
        (forPheromones/matrix[visited[i]][visited[i + 1]].distanceLength);
    }
}

function antAlgorithm(visited)
{
    allPaths = [];

    for(let i = 0; i < points.length; i++) {
        visited.push(i);
        let probabilities = calcProbability(visited, matrix[i]);
        while(visited.length !== points.length) {
            let coolPoint = select(visited, probabilities);
            if(!(visited.includes(coolPoint))) {
                visited.push(coolPoint);
                if(visited.length < points.length) {
                    probabilities = calcProbability(visited, matrix[coolPoint]);
                }
            }
        }
        visited.push(i);
        allPaths.push({ path: [...visited], pathLength: sumDistance(visited) });
        visited = [];
    }
}

function sorting() {
    allPaths.sort((a, b) => a.pathLength - b.pathLength);
}

document.getElementById('first').onclick = start;

async function start() {
    if (points.length !== 0) {
        document.getElementById('second').disabled = true;
        document.getElementById('third').disabled = true;

        getCountIteration();
        getMatrix();

        let bestDistance = Infinity;
        bestPath = [];
        
        for(let iteration = 0; iteration < countOfIteration; iteration++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPoints();

            let visited = [];
            antAlgorithm(visited);
            updateOfPheromones(allPaths[0].path);
            sorting();
            if(allPaths[0].pathLength < bestDistance) {
                bestDistance = allPaths[0].pathLength;
                bestPath = allPaths[0].path;

                drawPath('white');
                await new Promise(resolve => setTimeout(resolve, 1));
            }
        }

        drawPath('MediumOrchid');

        document.getElementById('second').disabled = false;
        document.getElementById('third').disabled = false;
    }
}