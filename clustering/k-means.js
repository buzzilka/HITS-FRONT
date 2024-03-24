function getRandomColor() {
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function generateUniqueColors(count) {
    const colors = [];
    while (colors.length < count) {
        const color = getRandomColor();
        if (!colors.includes(color)) {
            colors.push(color);
        }
    }
    return colors;
}

function cluster(clusterCount, points, canvas, ctx) {
    let clusters = [];
    
    const uniqueColors = generateUniqueColors(clusterCount);

    // Инициализируем кластеры случайным образом
    for (let i = 0; i < clusterCount; i++) {
        clusters.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            points: [],
            color: uniqueColors[i] // Выбираем уникальный цвет для каждого кластера
        });
    }
    // Функция для вычисления расстояния между двумя точками
    function distance(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }
    
    // Присваиваем каждую точку к ближайшему кластеру
    points.forEach(point => {
        let minDistance = Number.MAX_VALUE;
        let closestCluster = null;
        
        clusters.forEach(cluster => {
            let dist = distance(point, cluster);
            if (dist < minDistance) {
                minDistance = dist;
                closestCluster = cluster;
            }
        });
        
        closestCluster.points.push(point);
    });
    
    // Перемещаем центры кластеров в среднее геометрическое точек в каждом кластере
    clusters.forEach(cluster => {
        if (cluster.points.length > 0) {
            let sumX = cluster.points.reduce((acc, p) => acc + p.x, 0);
            let sumY = cluster.points.reduce((acc, p) => acc + p.y, 0);
            cluster.x = sumX / cluster.points.length;
            cluster.y = sumY / cluster.points.length;
        }
    });
    
    // Очищаем предыдущие кластеры и перерисовываем их
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    clusters.forEach(cluster => {
        ctx.fillStyle = cluster.color;
        ctx.beginPath();
        ctx.arc(cluster.x, cluster.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        cluster.points.forEach(point => {
            ctx.fillStyle = cluster.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    });
}

export {cluster};