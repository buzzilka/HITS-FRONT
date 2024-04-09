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
    //joinPoints('white');
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
    ctx.fillStyle = 'white';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

async function drawPath(arr) {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    for (let j = 0; j < arr.length - 1; j++) {
        ctx.moveTo(arr[j].x, arr[j].y);
        ctx.lineTo(arr[j + 1].x, arr[j + 1].y);
        ctx.stroke();
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    ctx.moveTo(arr[0].x, arr[0].y);
    ctx.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
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
    //joinPoints('black');
}

function getGenerationCount() {
    let num = document.getElementById('generation_size').value;
    if (num == "") {
        alert("Введите количество поколений");
    }
    else {
        generationCount = parseInt(num);
    }
}

function getPopulationCount() {
    let num = document.getElementById('population_size').value;
    if (num == "") {
        alert("Введите размер популяции");
    }
    else {
        populationCount = parseInt(num);
    }
}

function getProbabilityMutation() {
    let num = document.getElementById('probability_mutation').value;
    if (num == "") {
        alert("Введите процент мутации");
    }
    else {
        probabilityMutation = parseInt(num);
    }
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
    population = [];
    let memory = [];
    let count = 0;
    let i = 0;

    getGenerationCount();
    getPopulationCount();
    getProbabilityMutation();

    for (let i = 0; i < populationCount; i++)
    {
        let f = randomPath();

        population.push({osob: f, length: sumDistance(f)});
    }
    
    for (i; i < generationCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 25));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //joinPoints('grey');
        drawPoints();

        geneticAlgorythm();

        let currentWay = population[0].osob;

        bestPath = population[0].osob;

        if (memory.toString() === bestPath.toString()) {
            count += 1;
        }
        else {
            count = 0;
            memory = bestPath;
        }

        if (count == 4) {
            i = generationCount;
        }

        ctx.strokeStyle = 'white';
        ctx.beginPath();
        for (let j = 0; j < currentWay.length - 1; j++) {
            ctx.moveTo(currentWay[j].x, currentWay[j].y);
            ctx.lineTo(currentWay[j + 1].x, currentWay[j + 1].y);
            ctx.stroke();
            drawPoints();
            await new Promise(resolve => setTimeout(resolve, 25));
        }
        ctx.moveTo(currentWay[0].x, currentWay[0].y);
        ctx.lineTo(currentWay[currentWay.length - 1].x, currentWay[currentWay.length - 1].y);
        ctx.stroke();
        drawPoints();
    }
}