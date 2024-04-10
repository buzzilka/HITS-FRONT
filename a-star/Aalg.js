const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let num, cellSize;
let cells;
let currentStart, currentFinish;
let isPending, flag = false;

function getNum(){
  num = document.getElementById('sizeLab').value;
  cellSize = canvas.width / num;
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
      cells[i][j]={typeOfEmpty:"empty",isWall:"wall"};
    }
  }
}
function emptyLab(){
  flag = true;
  getNum();
  cells = new Array(num);
  for (let i = 0; i < num; i++) {
    cells[i]=new Array(num);//массив стен и коридоров
    for (let j = 0;j<num;j++){
      cells[i][j]={typeOfEmpty:"empty",isWall:"empty"};
    }
  }
  setDefaultStartFinish();
  display();
}
function clearPath()
{
  for (let y = 0; y < num; y++) {
    for (let x = 0; x < num; x++) {
      if ((cells[y][x].typeOfEmpty == "path" || cells[y][x].typeOfEmpty == "findPath") && cells[y][x].isWall == "empty"){
        cells[y][x].typeOfEmpty = "empty"; 
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
      if (cells[y][x].isWall == "wall")
      {
        ctx.clearRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
      else if (cells[y][x].typeOfEmpty == "empty"){
        ctx.fillStyle = 'white';
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize); 
      }
      else if (cells[y][x].typeOfEmpty == "start")
      {
        ctx.fillStyle = 'green';
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
      else if (cells[y][x].typeOfEmpty == "finish"){
        ctx.fillStyle = 'red';
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
      else if (cells[y][x].typeOfEmpty == "path"){
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
  function toCheck(x,y,check,isUsed)
  {
    if (y - 2 >= 0 && cells[y-2][x].isWall == "wall" && isUsed[y-2][x]!=true) {
      check.push({x: x, y: y-2});
      isUsed[y-2][x]=true;
    }
    if (y + 2 < num && cells[y+2][x].isWall=="wall" && isUsed[y+2][x]!=true) {
      check.push({x: x, y: y+2});
      isUsed[y+2][x]=true;
    }
    if (x - 2 >= 0 && cells[y][x-2].isWall=="wall" && isUsed[y][x-2]!=true) {
      check.push({x: x - 2, y: y});
      isUsed[y][x-2]=true;
    }
    if (x + 2 < num && cells[y][x+2].isWall=="wall" && isUsed[y][x+2]!=true) {
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
  cells[y][x].isWall="empty";
  isUsed[y][x]=true;
  currentStart={x:x,y:y,type:cells[y][x].typeOfEmpty};//установка старта

  //добавление возможных точек перехода
  let check = [];
  toCheck(x,y,check,isUsed);

 //пока есть элементы в массиве, выбрать один 
  while (check.length > 0) {
    let index = Math.floor(Math.random() * check.length);
    x = check[index].x;
    y = check[index].y;
    cells[y][x].isWall="empty";
    check.splice(index,1);
    currentFinish={x:x,y:y,type:cells[y][x].typeOfEmpty};//установка финиша

    //и убрать стены
    let d = [0,1,2,3];
    while (d.length>0) {
      let rand = Math.floor(Math.random() * d.length);
      if (y - 2 >= 0 && cells[y-2][x].isWall=="empty" && d[rand]==0) {
        cells[y-1][x].isWall="empty";
        d.length=0;
      }
      if (y + 2 < num && cells[y+2][x].isWall=="empty" && d[rand]==1) {
        cells[y+1][x].isWall="empty";
        d.length=0;
      }
      if (x - 2 >= 0 && cells[y][x-2].isWall=="empty" && d[rand]==2) {
        cells[y][x-1].isWall="empty";
        d.length=0;
      }
      if (x + 2 < num && cells[y][x+2].isWall=="empty" && d[rand]==3) {
        cells[y][x+1].isWall="empty";
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
      if (i == 0 && cells[i][num - 2].isWall == "empty" || cells[i - 1][num - 1].isWall == "wall" && cells[i][num - 2].isWall == "empty" || 
      cells[i - 1][num - 1].isWall == "empty" && cells[i][num - 2].isWall == "wall" || 
      cells[i - 1][num - 1].isWall == "empty" && cells[i][num - 2].isWall == "empty" && cells[i - 1][num - 2].isWall == "wall"){
        cells[i][num - 1].isWall = arr[Math.floor(Math.random() * 2)];
      }
      if (i == 0 && cells[num - 2][i].isWall == "empty" || cells[num - 1][i - 1].isWall == "wall" && cells[num - 2][i].isWall == "empty" || 
      cells[num - 1][i - 1].isWall == "empty" && cells[num - 2][i].isWall == "wall" ||
      cells[num - 1][i - 1].isWall == "empty" && cells[num - 2][i].isWall == "empty" && cells[num - 2][i - 1].isWall == "wall"){
        cells[num - 1][i].isWall = arr[Math.floor(Math.random() * 2)];
      }
    }
  }
}

function setDefaultStartFinish(){
  cells[num-2][num-1].isWall="empty";//проход до финиша
  cells[0][1].isWall="empty";//проход до старта
  currentStart={x:0,y:0,type:cells[0][0].typeOfEmpty};
  cells[0][0].typeOfEmpty="start";
  currentFinish={x:num-1,y:num-1,type:cells[num-1][num-1].typeOfEmpty};
  cells[num-1][num-1].typeOfEmpty="finish";
}
function setStartFinish(){
  cells[currentStart.y][currentStart.x].typeOfEmpty="start";
  cells[currentFinish.y][currentFinish.x].typeOfEmpty="finish";
}

function display()
{
  clear();
  drawLabyrinth();
  drawGrid();
}
function create(){
  flag = true;
  getNum();
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

canvas.addEventListener('click', function(event) {
  if (num == null || isPending){
    return;
  }
  else{
    const rect = canvas.getBoundingClientRect();  //координаты клика
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (change=="walls"){
      if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].isWall=="wall"){
        cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].isWall="empty";
      }
      else if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty=="start"||
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty=="finish"){
        return;
      }
      else{
        cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].isWall="wall";
      }
    }
    if (change=="begin"){
      if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].isWall=="wall" || 
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty=="finish"){
        return;
      }
      else if (cells[currentStart.y][currentStart.x].typeOfEmpty=="start"){
      //убрать старый старт
      cells[currentStart.y][currentStart.x].typeOfEmpty=currentStart.type;
      }
      //обозначить новый старт
      currentStart={x:Math.floor(x/cellSize),y:Math.floor(y/cellSize),type:cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty};
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty="start";
    }
    if (change=="end"){
      if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].isWall=="wall" ||
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty=="start"){
        return;
      }
      else if (cells[currentFinish.y][currentFinish.x].typeOfEmpty=="finish"){
      cells[currentFinish.y][currentFinish.x].typeOfEmpty=currentFinish.type;
      }
      currentFinish={x:Math.floor(x/cellSize),y:Math.floor(y/cellSize),type:cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty};
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)].typeOfEmpty="finish";  
    }
    display();
  }
});

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
  reachable.push({x:currentStart.x,y:currentStart.y,toStart:0,allPath:0,parent:null});
  let explored = new Array; //проверенные клетки
  let current;
  while (reachable.length > 0 && !flag) {//пока есть клетки для проверки
    reachable.sort(compare);
    current = reachable.shift();//берём клетку с наименьшей суммарной дистанцией
    explored.push(current);
    if (current.x == currentFinish.x && current.y == currentFinish.y) { //нашли финиш
      break;
    }
    let ways = [{x:1, y:0}, {x:0, y:1}, {x:-1, y:0}, {x:0, y:-1}];
    for (let i = 0; i < ways.length; i++) {//проверить соседей текущей клетки
      let neighbour = {x:current.x + ways[i].x, y:current.y + ways[i].y, toStart:0, allPath:0, parent:null};
      let isReachable = reachable.find(cell => (cell.x == neighbour.x && cell.y == neighbour.y));
      let isExplored = explored.find(cell => (cell.x == neighbour.x && cell.y == neighbour.y));
      if (neighbour.x >= 0 && neighbour.x < num && neighbour.y >= 0 && neighbour.y < num ){//если клетка существует
        if (cells[neighbour.y][neighbour.x].isWall != "wall" && isExplored == null) {//и пустая и не использована 
          if (isReachable == null) {//и не находится в reachable просчитать дистанции
            if(neighbour.x != currentFinish.x || neighbour.y != currentFinish.y){
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
function deletePath()
{
  flag = true;
  clearPath();
  display();
}
function start(){
  if (num==null){
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

