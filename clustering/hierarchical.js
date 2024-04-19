function distance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

function agglomerativeClustering(points, clusterCount) {
    let clusters = points.map(point => [point]); 

    while (clusters.length > clusterCount) {
        let minDistance = Number.MAX_VALUE;
        let closestClusters = [];

        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const cluster1 = clusters[i];
                const cluster2 = clusters[j];
                const avgDistance = clusterDistance(cluster1, cluster2);
                if (avgDistance < minDistance) {
                    minDistance = avgDistance;
                    closestClusters = [i, j];
                }
            }
        }

        const mergedCluster = clusters[closestClusters[0]].concat(clusters[closestClusters[1]]);
        clusters.splice(closestClusters[1], 1);
        clusters.splice(closestClusters[0], 1, mergedCluster);
    }

    return clusters;
}

function clusterDistance(cluster1, cluster2) {
    let totalDistance = 0;
    let count = 0;
    cluster1.forEach(point1 => {
        cluster2.forEach(point2 => {
            totalDistance += distance(point1, point2);
            count++;
        });
    });
    return totalDistance / count;
}

function drawClusters(ctx, clusters, colors) {
    clusters.forEach((cluster, index) => {
        const color = colors[index % colors.length];
        cluster.forEach(point => {
            const size = 10;
            const lineWidth = 3;

            ctx.strokeStyle = color; 
            ctx.lineWidth = lineWidth; 
            ctx.strokeRect(point.x - size / 2, point.y - size / 2, size, size);
        });
    });
}

function hierarchical(points, ctx, clusterCount, colors){
    const clusters = agglomerativeClustering(points, clusterCount);
    drawClusters(ctx, clusters, colors);
}

export {hierarchical};