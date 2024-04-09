const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let num, cellSize;
let cells;
let currentStart, currentFinish;

function input(){
  num = document.getElementById('number-in').value;
  if (num==""){
    alert("Введите число")
  }
  else{
    cellSize = canvas.width / num;
    create();
  }
}

function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function clearLabyrinth()
{
  cells = new Array(num);
  for (let i = 0; i < num; i++) {
    cells[i]=new Array(num);//массив стен и коридоров
    for (let j = 0;j<num;j++){
      cells[i][j]="wall";
    }
  }
}
function clearPath()
{
  for (let y = 0; y < num; y++) {
    for (let x = 0; x < num; x++) {
      if (cells[y][x] == "path" || cells[y][x] == "findPath"){
        cells[y][x] = "empty"; 
      }
    }
  }
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
  for (let y = 0; y < num; y++) {
    for (let x = 0; x < num; x++) {
      if (cells[y][x] == "empty"){
        ctx.fillStyle = 'white';
        ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2); 
      }
      else if (cells[y][x] == "start")
      {
        ctx.fillStyle = 'green';
        ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
      }
      else if (cells[y][x] == "wall")
      {
        ctx.clearRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
      }
      else if (cells[y][x] == "finish"){
        ctx.fillStyle = 'red';
        ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
      }
      else if (cells[y][x] == "path"){
        ctx.fillStyle = 'SkyBlue';
        ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
      }
      else{
        ctx.fillStyle = 'pink';
        ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
      }
    }
  }
}

function generateLabyrinth(){
  function toCheck(x,y,check,isUsed)
  {
    if (y - 2 >= 0 && cells[y-2][x]=="wall" && isUsed[y-2][x]!=true) {
      check.push({x: x, y: y-2});
      isUsed[y-2][x]=true;
    }
    if (y + 2 < num && cells[y+2][x]=="wall" && isUsed[y+2][x]!=true) {
      check.push({x: x, y: y+2});
      isUsed[y+2][x]=true;
    }
    if (x - 2 >= 0 && cells[y][x-2]=="wall" && isUsed[y][x-2]!=true) {
      check.push({x: x - 2, y: y});
      isUsed[y][x-2]=true;
    }
    if (x + 2 < num && cells[y][x+2]=="wall" && isUsed[y][x+2]!=true) {
      check.push({x: x + 2, y: y});
      isUsed[y][x+2]=true;
    }
  }
  let isUsed = new Array(num);//массив для генерации
  for (let i = 0; i < num; i++) {
    isUsed[i] = new Array(num);
    for (let j = 0;j<num;j++){
      isUsed[i][j] = false;
    }
  }

  //выбор точки начала
  let x = Math.floor(Math.random() * num / 2) * 2;
  let y = Math.floor(Math.random() * num / 2) * 2;
  cells[y][x]="empty";
  isUsed[y][x]=true;
  currentStart={x:x,y:y,type:cells[y][x]};//установка старта

  //добавление возможных точек перехода
  let check = [];
  toCheck(x,y,check,isUsed);

 //пока есть элементы в массиве, выбрать один 
  while (check.length > 0) {
    let index = Math.floor(Math.random() * check.length);
    x = check[index].x;
    y = check[index].y;
    cells[y][x]="empty";
    check.splice(index,1);
    currentFinish={x:x,y:y,type:cells[y][x]};//установка финиша

    //и убрать стены
    let d = [0,1,2,3];
    while (d.length>0) {
      let rand = Math.floor(Math.random() * d.length);
      if (y - 2 >= 0 && cells[y-2][x]=="empty" && d[rand]==0) {
        cells[y-1][x]="empty";
        d.length=0;
      }
      if (y + 2 < num && cells[y+2][x]=="empty" && d[rand]==1) {
        cells[y+1][x]="empty";
        d.length=0;
      }
      if (x - 2 >= 0 && cells[y][x-2]=="empty" && d[rand]==2) {
        cells[y][x-1]="empty";
        d.length=0;
      }
      if (x + 2 < num && cells[y][x+2]=="empty" && d[rand]==3) {
        cells[y][x+1]="empty";
        d.length=0;
      }
      d.splice(rand,1);
    }

    //добавление возможных точек перехода
    toCheck(x,y,check,isUsed);
  }
  let arr = ["empty","wall"];
  if (num % 2 == 0){
    for (let i = 0; i < num; i++){
      if (i == 0 && cells[i][num - 2] == "empty" || cells[i - 1][num - 1] == "wall" && cells[i][num - 2] == "empty" || 
      cells[i - 1][num - 1] == "empty" && cells[i][num - 2] == "wall" || 
      cells[i - 1][num - 1] == "empty" && cells[i][num - 2] == "empty" && cells[i - 1][num - 2] == "wall"){
        cells[i][num - 1] = arr[Math.floor(Math.random() * 2)];
      }
      if (i == 0 && cells[num - 2][i] == "empty" || cells[num - 1][i - 1] == "wall" && cells[num - 2][i] == "empty" || 
      cells[num - 1][i - 1] == "empty" && cells[num - 2][i] == "wall" ||
      cells[num - 1][i - 1] == "empty" && cells[num - 2][i] == "empty" && cells[num - 2][i - 1] == "wall"){
        cells[num - 1][i] = arr[Math.floor(Math.random() * 2)];
      }
    }
  }
}

function setDefaultStartFinish(){
  cells[num-2][num-1]="empty";//проход до финиша
  cells[0][1]="empty";//проход до старта
  currentStart={x:0,y:0,type:cells[0][0]};
  cells[0][0]="start";
  currentFinish={x:num-1,y:num-1,type:cells[num-1][num-1]};
  cells[num-1][num-1]="finish";
}
function setStartFinish(){
  cells[currentStart.y][currentStart.x]="start";
  cells[currentFinish.y][currentFinish.x]="finish";
}

function display()
{
  clear();
  drawGrid();
  drawLabyrinth();
}
function create(){
  clearLabyrinth();
  generateLabyrinth();
  //setDefaultStartFinish();
  setStartFinish();
  display();
}

let change = document.getElementById('redact').value;
function redact() {
  change = document.getElementById('redact').value;
}

let startFinish="startFinish";//для отмены стен
canvas.addEventListener('click', function(event) {
  if (num==null){
    alert("Создайте лабиринт")
  }
  else{
    const rect = canvas.getBoundingClientRect();  //координаты клика
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (change=="walls"){
      if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=="wall"){
        if (Math.floor(y/cellSize)==currentStart.y && Math.floor(x/cellSize)==currentStart.x && startFinish!="finish"){
          cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="start";
        }
        else if (Math.floor(y/cellSize)==currentFinish.y && Math.floor(x/cellSize)==currentFinish.x  && startFinish!="start"){
          cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="finish";
        }
        else{
          cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="empty";
        }
      }
      else{
        cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="wall";
      }
    }
    if (change=="begin"){
      if (cells[currentStart.y][currentStart.x]=="start"){
      //убрать старый старт
      cells[currentStart.y][currentStart.x]=currentStart.type;
      }
      if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=="finish"){//для отмены стен
        startFinish="start";
      }
      //обозначить новый старт
      currentStart={x:Math.floor(x/cellSize),y:Math.floor(y/cellSize),type:cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]};
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="start";
    }
    if (change=="end"){
      if (cells[currentFinish.y][currentFinish.x]=="finish"){
      cells[currentFinish.y][currentFinish.x]=currentFinish.type;
      }
      if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=="start"){//для отмены стен
        startFinish="finish";
      }
      currentFinish={x:Math.floor(x/cellSize),y:Math.floor(y/cellSize),type:cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]};
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="finish";  
    }
    display();
  }
});

async function aStar(){
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
  reachable.push({x:currentStart.x,y:currentStart.y,toStart:0,allPath:0,parent:null});
  let explored = new Array; //проверенные клетки
  let current;
  while (reachable.length > 0) {//пока есть клетки для проверки
    reachable.sort(compare);
    current = reachable.shift();//берём клетку с наименьшей суммарной дистанцией
    explored.push(current);
    if (current.x == currentFinish.x && current.y == currentFinish.y) { //нашли финиш
      break;
    }
    if ((current.x != currentStart.x || current.y != currentStart.y) && (current.x != currentFinish.x || current.y != currentFinish.y)) {
      cells[current.y][current.x] = "findPath";
      await new Promise(resolve => setTimeout(resolve, 5));
      display();
    }

    let ways = [{x:1, y:0}, {x:0, y:1}, {x:-1, y:0}, {x:0, y:-1}];
    for (let i = 0; i < ways.length; i++) {//проверить соседей текущей клетки
      let neighbour = {x:current.x + ways[i].x, y:current.y + ways[i].y, toStart:0, allPath:0, parent:null};
      let isReachable = reachable.find(cell => (cell.x == neighbour.x && cell.y == neighbour.y));
      let isExplored = explored.find(cell => (cell.x == neighbour.x && cell.y == neighbour.y));
      if (neighbour.x >= 0 && neighbour.x < num && neighbour.y >= 0 && neighbour.y < num ){//если клетка существует
        if (cells[neighbour.y][neighbour.x] != "wall" && isExplored == null) {//и пустая и не использована 
          if (isReachable == null) {//и не находится в reachable просчитать дистанции
            if(neighbour.x != currentFinish.x || neighbour.y != currentFinish.y){
              cells[neighbour.y][neighbour.x] = "findPath";
              await new Promise(resolve => setTimeout(resolve, 5));
              display();
            }
            neighbour.toStart = current.toStart + 1;
            neighbour.allPath = neighbour.toStart + heuristic(neighbour, currentFinish);
            neighbour.parent = current;
            reachable.push(neighbour);
          } 
          else {// если клетка находится в reachable изменить дистанцию до старта если нужно
            if (isReachable.allPath >= current.allPath + 1) {
              reachable[reachable.indexOf(isReachable)].toStart = current.toStart + 1;
              reachable[reachable.indexOf(isReachable)].parent = current;
            }
          }
        }
      }
    }
  }

if (current.x == currentFinish.x && current.y == currentFinish.y) {//если найден финеш рисуем путь
  current=current.parent;
  for(;current.parent != null; current = current.parent) {
    cells[current.y][current.x]="path";
    await new Promise(resolve => setTimeout(resolve, 10));
    display();
  }
  setTimeout(() => alert("Путь найден :)"), 100);
} 
else {
  alert("Пути нет :(");
}
}

function start(){
  if (num==null){
    alert("Создайте лабиринт")
  }
  else{
    if (cells[currentStart.y][currentStart.x]!="start" && cells[currentFinish.y][currentFinish.x]!="finish"){
    alert("please, set start and finish");
    }
    else if (cells[currentStart.y][currentStart.x]!="start"){
      alert("please, set start");
    }
    else if (cells[currentFinish.y][currentFinish.x]!="finish"){
      alert("please, set finish");
    }
    clearPath();
    display();
    aStar();
  }
}

let audio1 = document.getElementById('audio1');
let audio2 = document.getElementById('audio2');
function play1() {
  audio2.pause();
  audio1.play();
}
function play2() {
  audio1.pause();
  audio2.play();
}
function pause() {
  audio1.pause();
  audio2.pause();
}
function volume(){
  audio1.volume = Math.random();
  audio2.volume = Math.random();
}

