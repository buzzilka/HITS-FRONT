const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var num, cellSize;
var cells = [];
function input()
{
  num = document.getElementById('number-in').value;
  cellSize = canvas.width / num;
  cells.length = num*num;
  create();
}

function create()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cells=cells.fill(0);

  ctx.beginPath();
  for (let i = 0; i <= num; i++) {
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
  }
  for (let i = 0; i <= num; i++) {
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
  }
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (cells[Math.floor(y/cellSize)*num+Math.floor(x/cellSize)]==0)
  {
    ctx.fillStyle = 'pink';
    ctx.fillRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2); 
    cells[Math.floor(y/cellSize)*num+Math.floor(x/cellSize)]=1;
  }
  else{
    ctx.clearRect(Math.floor(x/cellSize)*cellSize+1, Math.floor(y/cellSize)*cellSize+1, cellSize-2, cellSize-2);
    cells[Math.floor(y/cellSize)*num+Math.floor(x/cellSize)]=0;
  }
});