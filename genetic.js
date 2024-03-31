const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = "14px serif";
let points = [];
let path = [];
let population = [];
let bestPath = [];
let populationCount = 1;
const probabilityMutation = 90;


canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.push({ x, y });

    drawPoints();
    joinPoints('black');
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

function sumDistance(arr) {
    let sum = 0;
    for (let i = 0, j = 1; j < arr.length; i++, j++) {
        sum += calcDistance(arr[i], arr[j]);
    }
    sum += calcDistance(arr[0], arr[arr.length - 1]);
    return sum;
}

function drawPoints() {
    ctx.fillStyle = 'black';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

async function drawPath(arr) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    for (let j = 0; j < arr.length - 1; j++) {
        ctx.moveTo(arr[j].x, arr[j].y);
        ctx.lineTo(arr[j + 1].x, arr[j + 1].y);
        ctx.stroke();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    ctx.moveTo(arr[0].x, arr[0].y);
    ctx.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
    ctx.stroke();
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
    joinPoints('black');
    drawDistance();
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

function sizeOfPopulation() {
    for (let i = 1; i < points.length; i++) {
        populationCount *= i;
    }
}

function sex() {
    let firstIndex = Math.floor(Math.random() * (populationCount - 1));
    let secondIndex = Math.floor(Math.random() * (populationCount - 1));

    if (firstIndex == secondIndex) {
        firstIndex = Math.floor(Math.random() * (populationCount - 1));
    }

    let mom = population[firstIndex].osob;
    let dad = population[secondIndex].osob;

    let child = [];

    let gens = new Set();
    let countOfGens =  Math.floor(Math.random() * (mom.length));

    for (let i = 0; i < countOfGens; i++) {
        child.push(mom[i]);
        gens.add(mom[i]);
    }
    for (let i = countOfGens; i < points.length; i++)
    {
        if (!gens.has(dad[i])) {
            child.push(dad[i]);
            gens.add(dad[i]);
        }
    }
    for (let i = countOfGens; i < points.length; i++) {
        if (mom.length != child.length && !(gens.has(mom[i]))) {
            child.push(mom[i]);
            gens.add(mom[i]);
        }
    }
    
    child = mutation(child);

    population.push({osob: child, length: sumDistance(child)});
}


function sorting() {
    population.sort((a, b) => a.length - b.length);
}

function mutation(child) {
    let percentOfMutation = Math.floor(Math.random() * (100));
    if (percentOfMutation < probabilityMutation) {
        let firstIndex = Math.floor(Math.random() * (child.length));
        let secondIndex = Math.floor(Math.random() * (child.length));

        if (firstIndex != secondIndex) {
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
    population.pop();
}

document.getElementById('first').onclick = start;

async function start() {
    populationCount = 1;
    population.length = 0;
    sizeOfPopulation();

    for (let i = 0; i < populationCount; i++)
    {
        let f = randomPath();

        population.push({osob: f, length: sumDistance(f)});
    }
    
    for (let i = 0; i < populationCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDistance();
        joinPoints('grey');
        drawPoints();

        geneticAlgorythm();

        let randomIndex = Math.floor(Math.random() * (population.length - 1));
        bestPath = population[randomIndex].osob;

        ctx.strokeStyle = 'red';
        ctx.beginPath();
        for (let j = 0; j < bestPath.length - 1; j++) {
            ctx.moveTo(bestPath[j].x, bestPath[j].y);
            ctx.lineTo(bestPath[j + 1].x, bestPath[j + 1].y);
            ctx.stroke();
            drawPoints();
        }
        ctx.moveTo(bestPath[0].x, bestPath[0].y);
        ctx.lineTo(bestPath[bestPath.length - 1].x, bestPath[bestPath.length - 1].y);
        ctx.stroke();
        drawPoints();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDistance();
    joinPoints('grey');
    drawPoints();

    bestPath = population[0].osob;

    drawPath(bestPath);
}