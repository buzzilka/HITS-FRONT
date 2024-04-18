const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const points = [];
const pheromone = 1;
const for_path = 1500;
const for_pheromones = 1000;
const evaporation = 0.5;
const alfa = 2;
const beta = 20;
let all_paths = [];
let best_path = [];
let count_of_iteration;
let matrix = [];

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.push({x, y});

    drawPoints();
});

function get_count_iteration() {
    let num = document.getElementById('iteration_count').value;
    count_of_iteration = parseInt(num);
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
    for (let j = 0; j < best_path.length - 1; j++) {
        ctx.moveTo(points[best_path[j]].x, points[best_path[j]].y);
        ctx.lineTo(points[best_path[j + 1]].x, points[best_path[j + 1]].y);
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

function get_matrix() {
    matrix = [];
    for(let i = 0; i < points.length; i++) {
        matrix[i] = [];
        for(let j = 0; j < points.length; j++) {
            if(i == j) {
                matrix[i][j] = {distance_length: 0, pheromones: 0, closeness: 0};
            }
            else {
                let distance = calcDistance(points[i], points[j]);
                matrix[i][j] = {distance_length: distance, pheromones: pheromone, closeness: for_path/distance};
            }
        }
    }
}

function calc_wishes(ant_wish) {
    let sum = 0;
    for(let i = 0; i < ant_wish.length; i++) {
        sum += ant_wish[i];
    }
    return sum;
}

function calc_probability(visited, path) {
    let probability = [];
    let ant_wish = [];

    for(let i = 0; i < path.length; i++) {
        if(!(visited.includes(i)) && path[i] != 0) {
            ant_wish[i] =  Math.pow(path[i].pheromones, alfa) * Math.pow(path[i].closeness, beta);
        }
        else {
            ant_wish[i] = 0;
        }
    }

    for(let i = 0; i < ant_wish.length; i++) {
        if(calc_wishes(ant_wish) != 0) {
            probability[i] = ant_wish[i]/calc_wishes(ant_wish);
        }
        else {
            probability[i] = 0;
        }
    }
    return probability;
}

function select(visited, probabilities) {
    let count_of_probability;
    let range = [];

    for(let i = 0; i < probabilities.length; i++) {
        if(!(visited.includes(i))) {
            count_of_probability = Math.round(probabilities[i] * 100);
            for(let j = 0; j < count_of_probability; j++) {
                range.push(i);
            }
        }
    }

    let selected_point = Math.floor(Math.random() * range.length);
    return range[selected_point];
}

function update_of_pheromones(visited) {
    for(let i = 0; i < visited.length - 1; i++) {
        matrix[visited[i]][visited[i + 1]].pheromones = (matrix[visited[i]][visited[i + 1]].pheromones * evaporation) + (for_pheromones/matrix[visited[i]][visited[i + 1]].distance_length);
    }
}

function ant_algorithm(visited)
{
    all_paths = [];

    for(let i = 0; i < points.length; i++) {
        visited.push(i);
        let probabilities = calc_probability(visited, matrix[i]);
        while(visited.length != points.length) {
            let cool_point = select(visited, probabilities);
            if(!(visited.includes(cool_point))) {
                visited.push(cool_point);
                if(visited.length < points.length) {
                    probabilities = calc_probability(visited, matrix[cool_point]);
                }
            }
        }
        visited.push(i);
        all_paths.push({ path: [...visited], path_length: sumDistance(visited) });
        visited = [];
    }
}

function sorting() {
    all_paths.sort((a, b) => a.path_length - b.path_length);
}

document.getElementById('first').onclick = start;

async function start() {
    document.getElementById('second').disabled = true;
    document.getElementById('third').disabled = true;

    get_count_iteration();
    get_matrix();

    let best_distance = Infinity;
    best_path = [];
    
    for(let iteration = 0; iteration < count_of_iteration; iteration++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPoints();

        let visited = [];
        ant_algorithm(visited);
        update_of_pheromones(all_paths[0].path);
        sorting();
        if(all_paths[0].path_length < best_distance) {
            best_distance = all_paths[0].path_length;
            best_path = all_paths[0].path;

            drawPath('white');
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }

    drawPath('MediumOrchid');

    document.getElementById('second').disabled = false;
    document.getElementById('third').disabled = false;
}