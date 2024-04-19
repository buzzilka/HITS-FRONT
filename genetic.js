const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = "14px serif";
let points = [];
let path = [];
let population = [];
let bestPath = [];
let populationCount;
let generationCount;
let probabilityMutation;


canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.push({ x, y });

    drawPoints();
});

function calcDistance(first, second) {
    return Math.hypot(first.x - second.x, first.y - second.y);
}

function sumDistance(arr) {
    let sum = 0;
    for (let i = 0, j = 1; j < arr.length; i++, j++) {
        sum += calcDistance(arr[i], arr[j]);
    }
    sum += calcDistance(arr[0], arr[arr.length - 1]);
    return sum;
}

function drawPoints() {
    ctx.fillStyle = '#FFF581';
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
        ctx.moveTo(bestPath[j].x, bestPath[j].y);
        ctx.lineTo(bestPath[j + 1].x, bestPath[j + 1].y);
        ctx.stroke();
    }
    ctx.moveTo(bestPath[0].x, bestPath[0].y);
    ctx.lineTo(bestPath[bestPath.length - 1].x, bestPath[bestPath.length - 1].y);
    ctx.stroke();
    drawPoints();
}

function joinPoints(color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
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
}

function getGenerationCount() {
    let num = document.getElementById('generation_size').value;
    generationCount = parseInt(num);
}

function getPopulationCount() {
    let num = document.getElementById('population_size').value;
    populationCount = parseInt(num);
}

function getProbabilityMutation() {
    let num = document.getElementById('probability_mutation').value;
    probabilityMutation = parseInt(num);
}

function getRandom() {
    for (let i = 0; i < points.length; i++) {
        path.push(points[i]);
    }
    for (let i = 0; i < points.length; i++) {
        let j = i + Math.floor(Math.random() * (points.length - i));
        [path[i], path[j]] = [path[j], path[i]];
    }
}

function randomPath() {
    path = [];
    getRandom();
    return path;
}

function sex() {
    for(let i = 0; i < populationCount - 1; i++) {
        let mom = population[i].osob;
        let dad = population[i + 1].osob;

        let child = [];
        let childGens = new Set();

        let countOfGens =  Math.floor(Math.random() * (mom.length - 2)) + 1;

        for (let i = 0; i < countOfGens; i++) {
            child.push(mom[i]);
            childGens.add(mom[i])
        }
        for (let i = countOfGens; i < dad.length; i++)
        {
            if (!childGens.has(dad[i])) {
                child.push(dad[i]);
                childGens.add(dad[i]);
            }
        }
        for (let i = 0; i < dad.length; i++) {
            if (!childGens.has(dad[i])) {
                child.push(dad[i]);
                childGens.add(dad[i]);
            }
        }

        child = mutation(child);
        
        population.push({osob: child, length: sumDistance(child)});
    }
}

function sorting() {
    population.sort((a, b) => a.length - b.length);
}

function mutation(child) {
    let percentOfMutation = Math.floor(Math.random() * (100));
    if (percentOfMutation < probabilityMutation) {
        let firstIndex = Math.floor(Math.random() * (child.length));
        let secondIndex = Math.floor(Math.random() * (child.length));

        if (firstIndex !== secondIndex) {
            [child[firstIndex], child[secondIndex]] = [child[secondIndex], child[firstIndex]];
        }
        else {
            firstIndex = Math.floor(Math.random() * (child.length));
            [child[firstIndex], child[secondIndex]] = [child[secondIndex], child[firstIndex]];
        }
    }
    return child;
}

function geneticAlgorythm()
{
    sex();
    sorting();
    while(population.length !== populationCount) {
        population.pop();
    }
}

document.getElementById('first').onclick = start;
async function start() {
    document.getElementById('second').disabled = true;
    document.getElementById('third').disabled = true;

    let lastWay = [];
    population = [];

    getGenerationCount();
    getPopulationCount();
    getProbabilityMutation();

    for (let i = 0; i < populationCount; i++)
    {
        let f = randomPath();

        population.push({osob: f, length: sumDistance(f)});
    }
    
    for (let i = 0; i < generationCount; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPoints();

        geneticAlgorythm();

        bestPath = population[0].osob;

        if (bestPath !== lastWay || i === 0) {
            let color = 'white';
            drawPath(color);
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        else {
            drawPath('white');
        }
        lastWay = population[0].osob;
    }

    bestPath = population[0].osob;
    drawPath('#FFF581');

    document.getElementById('second').disabled = false;
    document.getElementById('third').disabled = false;
}