const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = "14px serif";
const points = [];
let path = [];
let population = [];
let bestPath = [];
let populationCount = 1;
const probabilityMutation = 70;


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

function sumDistance(arr) {
    let sum = 0;
    for (let i = 0, j = 1; j < arr.length; i++, j++) {
        sum += calcDistance(arr[i], arr[j]);
    }
    return sum;
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
    ctx.strokeStyle = 'black';
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

function getRandom() {
    for (let i = points.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        [path[i], path[j]] = [path[j], path[i]];
    }
}

function randomPath() {
    path = points;
    getRandom();
    return path;
}

function sizeOfPopulation() {
    for (let i = 1; i <= points.length; i++) {
        populationCount *= i;
    }
}

function sex() {
    let firstIndex = Math.floor(Math.random() * (populationCount - 1));
    let secondIndex = Math.floor(Math.random() * (populationCount - 1));

    let mom = population[firstIndex].osob;
    let dad = population[secondIndex].osob;

    let firstChild = [];
    let secondChild = [];

    let firstGens = new Set();
    let secondGens = new Set();

    for (let i = 0; i < 2; i++) {
        firstChild.push(mom[i]);
        firstGens.add(mom[i]);

        secondChild.push(dad[i]);
        secondGens.add(dad[i]);
    }
    for (let i = 2; i < points.length; i++)
    {
        if (!firstGens.has(dad[i])) {
            firstChild.push(dad[i]);
            firstGens.add(dad[i]);
        }
        if (!secondGens.has(mom[i])) {
            secondChild.push(mom[i]);
            secondGens.add(mom[i]);
        }
    }
    for (let i = 2; i < points.length; i++) {
        if (mom.length != firstChild.length && !(firstGens.has(mom[i]))) {
            firstChild.push(mom[i]);
            firstGens.add(mom[i]);
        }
        if (mom.length != secondChild.length && !(secondGens.has(dad[i]))) {
            secondChild.push(dad[i]);
            secondGens.add(dad[i]);
        }
    }

    mutation(firstChild);
    mutation(secondChild);

    population.push({osob: firstChild, length: sumDistance(firstChild)});
    population.push({osob: secondChild, length: sumDistance(secondChild)});
}


function sorting() {
    population.sort((a, b) => a.length - b.length);
}

function mutation(child) {
    let percentOfMutation = Math.floor(Math.random() * (100));
    if (percentOfMutation < probabilityMutation) {
        let firstIndex = Math.floor(Math.random() * (points.length - 1));
        let secondIndex = Math.floor(Math.random() * (points.length - 1));

        [child[firstIndex], child[secondIndex]] = [child[secondIndex], child[firstIndex]];
    }
}

function geneticAlgorythm()
{
    sex();
    sorting();
    population.size = population.size - 2;
}

document.getElementById('first').onclick = start;

async function start() {
    sizeOfPopulation();

    for (let i = 0; i < populationCount; i++)
    {
        let f = randomPath();

        population.push({osob: f, length: sumDistance(f)});
    }
    
    for (let i = 0; i < populationCount; i++)
    {
        geneticAlgorythm();

        bestPath = population[0].osob;
        
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        for (let j = 0; j < bestPath.length; j++) {
            ctx.moveTo(bestPath[j].x, bestPath[j].y);
            ctx.lineTo(bestPath[j + 1].x, bestPath[j + 1].y);
            ctx.stroke();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        joinPoints();
    }
    bestPath = population[0].osob;
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    for (let j = 0; j < bestPath.length; j++) {
        ctx.moveTo(bestPath[j].x, bestPath[j].y);
        ctx.lineTo(bestPath[j + 1].x, bestPath[j + 1].y);
        ctx.stroke();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}