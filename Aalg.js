const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var num, cellSize;
var cells;

function input()
{
  num = document.getElementById('number-in').value;
  cellSize = canvas.width / num;
  create();
}

function create()
{
  //очистка
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cells = new Array(num);
  let isUsed = new Array(num);
  for (let i = 0; i < num; i++) {
    cells[i]=new Array(num);
    isUsed[i] = new Array(num);
    for (let j = 0;j<num;j++){
      cells[i][j]=1;
      isUsed[i][j] = false;
    }
  }

  //сетка
  ctx.beginPath();
  for (let i = 0; i <= num; i++) {
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
  }
  for (let i = 0; i <= num; i++) {
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
  }
  ctx.strokeStyle = 'grey';
  ctx.stroke();

  //лабиритнт(Прим)
  var x = Math.floor(Math.random() * Math.floor(num / 2)) * 2 + 1;
  var y = Math.floor(Math.random() * Math.floor(num / 2)) * 2 + 1;
  cells[x][y]=0;
  isUsed[x][y]=true;
  var check = [];
  if (y - 2 >= 0) {
    check.push({x: x, y: y-2});
    isUsed[x][y-2]=true;
  }
  if (y + 2 < num) {
    check.push({x: x, y: y+2});
    isUsed[x][y+2]=true;
  }
  if (x - 2 >= 0) {
    check.push({x: x - 2, y: y});
    isUsed[x-2][y]=true;
  }
  if (x + 2 < num) {
    check.push({x: x + 2, y: y});
    isUsed[x+2][y]=true;
  }

  while (check.length > 0) {
    var index = Math.floor(Math.random() * check.length);
    x = check[index].x;
    y = check[index].y;
    cells[x][y]=0;
    check.splice(index,1);

    var d = [0,1,2,3];
    while (d.length>0) {
      var rand = Math.floor(Math.random() * d.length);
      if (y - 2 >= 0 && cells[x][y - 2]==0 && d[rand]==0) {
        cells[x][y - 1]=0;
        d.length=0;
      }
      if (y + 2 < num && cells[x][y + 2]==0 && d[rand]==1) {
        cells[x][y + 1]=0;
        d.length=0;
      }
      if (x - 2 >= 0 && cells[x - 2][y]==0 && d[rand]==2) {
        cells[x - 1][y]=0;
        d.length=0;
      }
      if (x + 2 < num && cells[x + 2][y]==0 && d[rand]==3) {
        cells[x + 1][y]=0;
        d.length=0;
      }
      d.splice(rand,1);
    }

    if (y - 2 >= 0 && cells[x][y - 2]==1 && isUsed[x][y-2]!=true) {
      check.push({x: x, y: y-2});
      isUsed[x][y-2]=true;
    }
    if (y + 2 < num && cells[x][y + 2]==1&& isUsed[x][y+2]!=true) {
      check.push({x: x, y: y+2});
      isUsed[x][y+2]=true;
    }
    if (x - 2 >= 0 && cells[x - 2][y]==1&& isUsed[x-2][y]!=true) {
      check.push({x: x - 2, y: y});
      isUsed[x-2][y]=true;
    }
    if (x + 2 < num && cells[x + 2][y]==1&& isUsed[x+2][y]!=true) {
      check.push({x: x + 2, y: y});
      isUsed[x+2][y]=true;
    }
  }
  for (let x = 0; x < num; x++) {
    for (let y = 0; y < num; y++) {
      if (cells[x][y]==0)
      {
        ctx.fillStyle = 'white';
        ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2); 
      }
    }
  }
  ctx.fillStyle = 'green';
  ctx.fillRect(1, 1, cellSize-2, cellSize-2);
  ctx.fillStyle = 'red';
  ctx.fillRect((num-1)*cellSize+1, (num-1)*cellSize+1, cellSize-2, cellSize-2);
}

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]==1)
  {
    ctx.fillStyle = 'white';
    ctx.fillRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2); 
    cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=0;
  }
  else{
    ctx.clearRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2);
    cells[Math.floor(y/cellSize)][Math.floor(x/cellSize)]=1;
  }
});