export {cells, cellSize, num, getNum, drawGrid, drawLabyrinth, generateLabyrinth, setDefaultStartFinish, setStartFinish, clearLabyrinth, currentFinish, currentStart};
import {ctx} from "../a-star/main.js";

let cells;
let num, cellSize;
let currentStart, currentFinish;

function getNum(){
    num = document.getElementById('sizeLab').value;
    cellSize = canvas.width / num;
}

function drawGrid(){
    ctx.beginPath();
    for (let i = 0; i <= num; i++) {//вертикали
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
    }
    for (let i = 0; i <= num; i++) {//горизонтали
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
    }
    ctx.strokeStyle = 'grey';
    ctx.stroke();
}

function drawLabyrinth(){
    for (let y in cells) {
        for (let x in cells) {
            if (cells[y][x].isWall === "wall"){
                ctx.clearRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
            else if (cells[y][x].typeOfEmpty === "empty"){
                ctx.fillStyle = 'white';
                ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize); 
            }
            else if (cells[y][x].typeOfEmpty === "start"){
                ctx.fillStyle = 'green';
                ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
            else if (cells[y][x].typeOfEmpty === "finish"){
                ctx.fillStyle = 'red';
                ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
            else if (cells[y][x].typeOfEmpty === "path"){
                ctx.fillStyle = 'SkyBlue';
                ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
            else{
                ctx.fillStyle = 'pink';
                ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
        }
    }
}
  
function generateLabyrinth(){
    function toCheck(x,y,check,isUsed){
        if (y - 2 >= 0 && cells[y-2][x].isWall === "wall" && isUsed[y-2][x] !== true) {
        check.push({x: x, y: y-2});
        isUsed[y-2][x] = true;
        }
        if (y + 2 < num && cells[y+2][x].isWall==="wall" && isUsed[y+2][x] !== true) {
        check.push({x: x, y: y+2});
        isUsed[y+2][x] = true;
        }
        if (x - 2 >= 0 && cells[y][x-2].isWall==="wall" && isUsed[y][x-2] !== true) {
        check.push({x: x - 2, y: y});
        isUsed[y][x-2] = true;
        }
        if (x + 2 < num && cells[y][x+2].isWall==="wall" && isUsed[y][x+2] !== true) {
        check.push({x: x + 2, y: y});
        isUsed[y][x+2] = true;
        }
    }

    let isUsed = new Array(num);//массив для генерации
    for (let i in cells) {
        isUsed[i] = new Array(num);
        for (let j in cells){
        isUsed[i][j] = false;
        }
    }

    //выбор точки начала
    let x = Math.floor(Math.random() * num / 2) * 2;
    let y = Math.floor(Math.random() * num / 2) * 2;
    cells[y][x].isWall = "empty";
    isUsed[y][x] = true;
    currentStart = {x:x,y:y,type:cells[y][x].typeOfEmpty};//установка старта

    //добавление возможных точек перехода
    let check = [];
    toCheck(x, y, check,isUsed);

    //пока есть элементы в массиве, выбрать один 
    while (check.length > 0) {
        let index = Math.floor(Math.random() * check.length);
        x = check[index].x;
        y = check[index].y;
        cells[y][x].isWall = "empty";
        check.splice(index, 1);
        currentFinish = {x:x, y:y, type:cells[y][x].typeOfEmpty};//установка финиша

        //и убрать стены
        let d = [0, 1, 2, 3];
        while (d.length > 0) {
            let rand = Math.floor(Math.random() * d.length);
            if (y - 2 >= 0 && cells[y-2][x].isWall === "empty" && d[rand] === 0) {
                cells[y-1][x].isWall = "empty";
                d.length = 0;
            }
            if (y + 2 < num && cells[y+2][x].isWall === "empty" && d[rand] === 1) {
                cells[y+1][x].isWall = "empty";
                d.length = 0;
            }
            if (x - 2 >= 0 && cells[y][x-2].isWall === "empty" && d[rand] === 2) {
                cells[y][x-1].isWall = "empty";
                d.length = 0;
            }
            if (x + 2 < num && cells[y][x+2].isWall === "empty" && d[rand] === 3) {
                cells[y][x+1].isWall = "empty";
                d.length =  0;
            }
            d.splice(rand, 1);
        }

        //добавление возможных точек перехода
        toCheck(x,y,check,isUsed);
    }

    let arr = ["empty","wall"];
    if (num % 2 === 0){//заполнение боковой линии
        for (let i = 0; i < num; i++){
            if (i === 0 && cells[i][num - 2].isWall === "empty" || cells[i - 1][num - 1].isWall === "wall" && cells[i][num - 2].isWall === "empty" || 
            cells[i - 1][num - 1].isWall === "empty" && cells[i][num - 2].isWall === "wall" || 
            cells[i - 1][num - 1].isWall === "empty" && cells[i][num - 2].isWall === "empty" && cells[i - 1][num - 2].isWall === "wall"){
                cells[i][num - 1].isWall = arr[Math.floor(Math.random() * 2)];
            }
            if (i === 0 && cells[num - 2][i].isWall === "empty" || cells[num - 1][i - 1].isWall === "wall" && cells[num - 2][i].isWall === "empty" || 
            cells[num - 1][i - 1].isWall === "empty" && cells[num - 2][i].isWall === "wall" ||
            cells[num - 1][i - 1].isWall === "empty" && cells[num - 2][i].isWall === "empty" && cells[num - 2][i - 1].isWall === "wall"){
                cells[num - 1][i].isWall = arr[Math.floor(Math.random() * 2)];
            }
        }
    }
}
  
function setDefaultStartFinish(){
    cells[num-2][num-1].isWall = "empty";//проход до финиша
    cells[0][1].isWall = "empty";//проход до старта
    currentStart={x:0, y:0, type:cells[0][0].typeOfEmpty};
    cells[0][0].typeOfEmpty = "start";
    currentFinish={x:num-1, y:num-1, type:cells[num-1][num-1].typeOfEmpty};
    cells[num-1][num-1].typeOfEmpty = "finish";
}
function setStartFinish(){
    cells[currentStart.y][currentStart.x].typeOfEmpty = "start";
    cells[currentFinish.y][currentFinish.x].typeOfEmpty = "finish";
}

function clearLabyrinth()
{
  cells = new Array(num);
  for (let i = 0; i < num; i++) {
    cells[i] = new Array(num);//массив стен и коридоров
    for (let j = 0; j < num; j++){
      cells[i][j] = {typeOfEmpty:"empty", isWall:"wall"};
    }
  }
}




