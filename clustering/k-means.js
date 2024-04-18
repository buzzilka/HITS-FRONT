const colors = [
    'red',
    'blue',
    'lime',
    'pink',
    'yellow',
    'purple',
    'orangered',
    'mediumspringgreen',
    'khaki',
    'indigo'
];

function weightedRandom(weights) {
    const total = weights.reduce((acc, val) => acc + val, 0);
    const rnd = Math.random() * total;
    
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (rnd < sum) {
            return i;
        }
    }
    
    return weights.length - 1;
}

function distance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

function initializeCentroidsKMeansPP(points, k) {
    const centroids = [points[Math.floor(Math.random() * points.length)]];

    while (centroids.length < k) {
        let distances = points.map(point => {
            let minDistance = centroids.reduce((min, centroid) => {
                return Math.min(min, distance(point, centroid));
            }, Infinity);
            return minDistance;
        });

        let nextCentroid = points[weightedRandom(distances)];
        centroids.push(nextCentroid);
    }

    return centroids;
}

function kMeans(clusterCount, points, ctx) {
    const centroids = initializeCentroidsKMeansPP(points, clusterCount);
    let clusters = centroids.map((centroid, i) => ({ x: centroid.x, y: centroid.y, points: [], color: colors[i] }));

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

    clusters.forEach(cluster => {
        if (cluster.points.length > 0) {
            let sum = cluster.points.reduce((acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }), { x: 0, y: 0 });
            cluster.x = sum.x / cluster.points.length;
            cluster.y = sum.y / cluster.points.length;
        }
    });

    clusters.forEach(cluster => {
        cluster.points.forEach(point => {
            ctx.fillStyle = cluster.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    });
}

export { kMeans };