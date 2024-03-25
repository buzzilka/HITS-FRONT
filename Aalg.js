const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var num, cellSize;
var cells;
var currentStart, currentFinish;

function input(){
  num = document.getElementById('number-in').value;
  cellSize = canvas.width / num;
  create();
}

function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cells = new Array(num);
  for (let i = 0; i < num; i++) {
    cells[i]=new Array(num);//массив стен и коридоров
    for (let j = 0;j<num;j++){
      cells[i][j]="wall";
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
function generateLabyrinth(){
  var isUsed = new Array(num);//массив для генерации
  for (let i = 0; i < num; i++) {
    isUsed[i] = new Array(num);
    for (let j = 0;j<num;j++){
      isUsed[i][j] = false;
    }
  }
  //выбор точки начала
  var x = Math.floor(Math.random() * num / 2) * 2;
  var y = Math.floor(Math.random() * num / 2) * 2;
  cells[y][x]="empty";
  isUsed[y][x]=true;
  currentStart={x:x,y:y,type:cells[y][x]};//установка старта

  //добавление возможных точек перехода
  var check = [];
  if (y - 2 >= 0) {
    check.push({x: x, y: y-2});
    isUsed[y-2][x]=true;
  }
  if (y + 2 < num) {
    check.push({x: x, y: y+2});
    isUsed[y+2][x]=true;
  }
  if (x - 2 >= 0) {
    check.push({x: x - 2, y: y});
    isUsed[y][x-2]=true;
  }
  if (x + 2 < num) {
    check.push({x: x + 2, y: y});
    isUsed[y][x+2]=true;
  }
 //пока есть элементы в массиве, выбрать один и убрать стены.
  while (check.length > 0) {
    var index = Math.floor(Math.random() * check.length);
    x = check[index].x;
    y = check[index].y;
    cells[y][x]="empty";
    check.splice(index,1);
    currentFinish={x:x,y:y,type:cells[y][x]};//установка финиша

    var d = [0,1,2,3];
    while (d.length>0) {
      var rand = Math.floor(Math.random() * d.length);
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
}
function drawLabyrinth(){
  for (let y = 0; y < num; y++) {
    for (let x = 0; x < num; x++) {
      if (cells[y][x]=="empty"){
        ctx.fillStyle = 'white';
        ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2); 
      }
    }
  }
}
function setDefaultStartFinish(){
  cells[num-2][num-1]="empty";//проход до финиша
  cells[0][1]="empty";//проход до старта
  ctx.fillStyle = 'green';
  ctx.fillRect(1, 1, cellSize-2, cellSize-2);
  currentStart={x:0,y:0,type:cells[0][0]};
  cells[0][0]="start";
  ctx.fillStyle = 'red';
  ctx.fillRect((num-1)*cellSize+1, (num-1)*cellSize+1, cellSize-2, cellSize-2);
  currentFinish={x:num-1,y:num-1,type:cells[num-1][num-1]};
  cells[num-1][num-1]="finish";
}
function setStartFinish(){
  ctx.fillStyle = 'green';
  ctx.fillRect(currentStart.x*cellSize+1, currentStart.y*cellSize+1, cellSize-2, cellSize-2);
  cells[currentStart.y][currentStart.x]="start";
  ctx.fillStyle = 'red';
  ctx.fillRect(currentFinish.x*cellSize+1, currentFinish.y*cellSize+1, cellSize-2, cellSize-2);
  cells[currentFinish.y][currentFinish.x]="finish";
}
function create(){
  clear();
  drawGrid();
  generateLabyrinth();
  //setDefaultStartFinish();
  drawLabyrinth();
  setStartFinish();
}

var change = document.getElementById('redact').value;
function redact() {
  change = document.getElementById('redact').value;
}
var startFinish="startFinish";//для отмены стен
canvas.addEventListener('click', function(event) {
  //координаты клика
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (change=="walls"){
    if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=="wall"){
      if (Math.floor(y/cellSize)==currentStart.y && Math.floor(x/cellSize)==currentStart.x && startFinish!="finish"){
        ctx.fillStyle = 'green';
        cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="start";
      }
      else if (Math.floor(y/cellSize)==currentFinish.y && Math.floor(x/cellSize)==currentFinish.x  && startFinish!="start"){
        ctx.fillStyle = 'red';
        cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="finish";
      }
      else{
        ctx.fillStyle = 'white';
        cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="empty";
      }
      ctx.fillRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2); 
    }
    else{
      ctx.clearRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2);
      cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="wall";
    }
  }
  if (change=="begin"){
    if (cells[currentStart.y][currentStart.x]=="start"){
    //убрать старый старт
    ctx.fillStyle = currentStart.type=="wall"?'black':currentStart.type=="empty"?'white':currentStart.type=="start"?'green':'red';
    ctx.fillRect(currentStart.x*cellSize+1, currentStart.y*cellSize+1, cellSize-2, cellSize-2); 
    cells[currentStart.y][currentStart.x]=currentStart.type;
    }
    if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=="finish"){//для отмены стен
      startFinish="start";
    }
    //обозначить новый старт
    ctx.fillStyle = 'green';
    ctx.fillRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2);
    currentStart={x:Math.floor(x/cellSize),y:Math.floor(y/cellSize),type:cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]};
    cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="start";
  }
  if (change=="end"){
    if (cells[currentFinish.y][currentFinish.x]=="finish"){
    ctx.fillStyle = currentFinish.type=="wall"?'black':currentFinish.type=="empty"?'white':currentFinish.type=="start"?'green':'red';
    ctx.fillRect(currentFinish.x*cellSize+1, currentFinish.y*cellSize+1, cellSize-2, cellSize-2); 
    cells[currentFinish.y][currentFinish.x]=currentFinish.type;
    }
    if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=="start"){//для отмены стен
      startFinish="finish";
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2);
    currentFinish={x:Math.floor(x/cellSize),y:Math.floor(y/cellSize),type:cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]};
    cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]="finish";  
  }
});
function heuristic(a, b){//Манхэттен
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function compare(a, b) {
  if (a.startToFinish > b.startToFinish){
      return 1;
  }
  else if (a.startToFinish < b.startToFinish){
      return -1;
  }
  else{
      return 0;
  }
}
function toCheck(x, y){
  return (x >= 0 && x < num && y >= 0 && y < num) ? true : false;
}
function aStar(){
  var reachable = new Array; //клетки для проверки
  reachable.push({x:currentStart.x,y:currentStart.y,toStart:0,toFinish:0,startToFinish:0,parent:null});
  var explored = new Array; //проверенные клетки
  var current;
  while (reachable.length > 0) {//пока есть клетки для проверки
    reachable.sort(compare);
    current = reachable[0];//берём клетку с наименьшей суммарной дистанцией
    reachable.splice(0, 1);
    explored.push(current);
    if (!(current.x == currentStart.x && current.y == currentStart.y) && !(current.x == currentFinish.x && current.y == currentFinish.y)) {
      ctx.fillStyle = 'pink';
      ctx.fillRect(current.x*cellSize+1, current.y*cellSize+1, cellSize-2, cellSize-2);
    }
    if (current.x == currentFinish.x && current.y == currentFinish.y) { // нашли финиш
      break;
    }
    //проверить соседей текущей клетки
    let ways = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (let i = 0; i < ways.length; i++) {
      var newNeighbour = {x:null,y:null,toStart:0,toFinish:0,startToFinish:0,parent:null};
      newNeighbour.x = current.x + ways[i][0];
      newNeighbour.y = current.y +ways[i][1];
      // проверить соседа на нахождение в массивах
      var neighbour = reachable.find(cell => (cell.x == newNeighbour.x && cell.y == newNeighbour.y));
      var isUsed = explored.find(cell => (cell.x == newNeighbour.x && cell.y == newNeighbour.y));
      if (toCheck(newNeighbour.x, newNeighbour.y) && cells[newNeighbour.y][newNeighbour.x] != "wall" && isUsed == null) {// если клетка не использована 
        if (neighbour == null) {//и не находится в reachable просчитать дистанции
          if(newNeighbour.x != currentFinish.x && newNeighbour.y != currentFinish.y){
            ctx.fillStyle = 'pink';
            ctx.fillRect(newNeighbour.x*cellSize+1, newNeighbour.y*cellSize+1, cellSize-2, cellSize-2); 
          }
          newNeighbour.toStart = current.toStart + 1;
          newNeighbour.toFinish = heuristic(newNeighbour, currentFinish);
          newNeighbour.startToFinish = newNeighbour.toStart + newNeighbour.toFinish;
          newNeighbour.parent = current;
          reachable.push(newNeighbour);
        } 
        else {// если клетка находится в reachable поменять дистанцию до старта если надо
          if (neighbour.startToFinish >= current.startToFinish + 1) {
            reachable[reachable.indexOf(neighbour)].toStart = current.toStart + 1;
            reachable[reachable.indexOf(neighbour)].parent = current;
          }
        }
      }
    }
  }
// не найден финиш
if (current.x != currentFinish.x && current.y != currentFinish.y) {
    alert("Не получается найти путь 😭");
} 
else {//рисуем путь
  console.log(current,current.parent);
  current=current.parent;
  for(;current.parent != null; current = current.parent) {
    console.log(current);
    ctx.fillStyle = 'blue';
    ctx.fillRect(current.x*cellSize+1, current.y*cellSize+1, cellSize-2, cellSize-2);
  }
}
}
function start(){
  if (cells[currentStart.y][currentStart.x]!="start" && cells[currentFinish.y][currentFinish.x]!="finish"){
  alert("please, set start and finish");
  }
  else if (cells[currentStart.y][currentStart.x]!="start"){
    alert("please, set start");
  }
  else if (cells[currentFinish.y][currentFinish.x]!="finish"){
    alert("please, set finish");
  }
  aStar();
}