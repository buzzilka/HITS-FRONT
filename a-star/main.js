import {cells, redact, num, display, currentFinish, currentStart, emptyLaby, laby} from "../a-star/labyrinth.js";
export{ctx, isPending}

document.getElementById("createLab").addEventListener("click", createLab);
document.getElementById("emptyLab").addEventListener("click", createEmptyLab);
document.getElementById("redact").addEventListener("change", redact);
document.getElementById("start").addEventListener("click", start);
document.getElementById("deletePath").addEventListener("click", deletePath);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isPending, flag = false;

function createLab(){
  flag = true;
  laby();
}

function createEmptyLab(){
    flag = true;
    emptyLaby();
}

function start(){
  if (num == null){
    alert("Создайте лабиринт");
  }
  else if(isPending){
    alert("Идёт поиск пути... Чтобы начать поиск сначала, очистите путь");
  }
  else{
    clearPath();
    display();
    flag = false;
    aStar();
  }
}

function deletePath()
{
  flag = true;
  clearPath();
  display();
}

async function aStar(){
    isPending = true;

    function heuristic(a, b){//Манхэттен
        return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    }
    function compare(a, b) {
        if (a.allPath > b.allPath){
            return 1;
        }
        else if (a.allPath < b.allPath){
            return -1;
        }
        else{
            return 0;
        }
    }
    
    let reachable = new Array; //клетки для проверки
    reachable.push({x: currentStart.x, y: currentStart.y, toStart: 0, allPath: 0, parent: null});
    let explored = new Array; //проверенные клетки
    let current;
    while (reachable.length > 0 && !flag) {//пока есть клетки для проверки
        reachable.sort(compare);
        current = reachable.shift();//берём клетку с наименьшей суммарной дистанцией
        explored.push(current);

        if (current.x === currentFinish.x && current.y === currentFinish.y) { //нашли финиш
        break;
        }

        let ways = [{x:1, y:0}, {x:0, y:1}, {x:-1, y:0}, {x:0, y:-1}];
        for (let way of ways) {//проверить соседей текущей клетки
            let neighbour = {x:current.x + way.x, y:current.y + way.y, toStart:0, allPath:0, parent:null};

            let isReachable = reachable.find(cell => (cell.x === neighbour.x && cell.y === neighbour.y));
            let isExplored = explored.find(cell => (cell.x === neighbour.x && cell.y === neighbour.y));

            if (neighbour.x >= 0 && neighbour.x < num && neighbour.y >= 0 && neighbour.y < num ){//если клетка существует
                if (cells[neighbour.y][neighbour.x].isWall !== "wall" && isExplored == null) {//и пустая и не использована 
                    if (isReachable == null) {//и не находится в reachable просчитать дистанции
                        if(neighbour.x !== currentFinish.x || neighbour.y !== currentFinish.y){
                            cells[neighbour.y][neighbour.x].typeOfEmpty = "findPath";
                            await new Promise(resolve => setTimeout(resolve, document.getElementById('speed').value));
                            if (flag) break;
                            display();
                        }
                        neighbour.toStart = current.toStart + 1;
                        neighbour.allPath = neighbour.toStart + heuristic(neighbour, currentFinish);
                        neighbour.parent = current;
                        reachable.push(neighbour);
                    } 
                    else if (isReachable.allPath >= current.allPath + 1){// если клетка находится в reachable изменить дистанцию до старта если нужно
                        reachable[reachable.indexOf(isReachable)].toStart = current.toStart + 1;
                        reachable[reachable.indexOf(isReachable)].parent = current;
                    }
                }
            }
        }
    }
  
    if (current.x === currentFinish.x && current.y === currentFinish.y) {//если найден финеш рисуем путь
        current = current.parent;
        for(;current.parent !== null; current = current.parent) {
        if (flag) break;
        cells[current.y][current.x].typeOfEmpty="path";
        await new Promise(resolve => setTimeout(resolve, 10));
        display();
        }
        setTimeout(() => alert("Путь найден :)"), 100);
    } 
    else if (!flag){
        alert("Не смогли найти путь :(");
    }
    isPending = false;
}

function clearPath()
{
    for (let y in cells) {
        for (let x in cells) {
            if ((cells[y][x].typeOfEmpty === "path" || cells[y][x].typeOfEmpty === "findPath") && cells[y][x].isWall === "empty"){
                cells[y][x].typeOfEmpty = "empty"; 
            }
        }
    }
}