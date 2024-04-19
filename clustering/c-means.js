function distance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function updateClusterCenters(points, memberships, numClusters,fuzzyNum) {
    const clusterCenters = [];
    for (let i = 0; i < numClusters; i++) {
        let sumX = 0, sumY = 0, totalWeight = 0;
        for (let j = 0; j < points.length; j++) {
            const weight = Math.pow(memberships[j][i], fuzzyNum);
            sumX += points[j].x * weight;
            sumY += points[j].y * weight;
            totalWeight += weight;
        }
        clusterCenters.push({ x: sumX / totalWeight, y: sumY / totalWeight });
    }
    return clusterCenters;
}

function fuzzyCMeans(points, numClusters, fuzzyNum, maxIterations) {
    const memberships = [];
    const epsilon = 0.001;

    for (let i = 0; i < points.length; i++) {
        const membership = [];
        let total = 0;
        for (let j = 0; j < numClusters; j++) {
            membership.push(Math.random());
            total += membership[j];
        }
        for (let j = 0; j < numClusters; j++) {
            membership[j] /= total;
        }
        memberships.push(membership);
    }

    let iteration = 0;
    let prevClusterCenters = null;
    let clusterCenters = updateClusterCenters(points, memberships, numClusters,fuzzyNum);

    while (iteration < maxIterations && (prevClusterCenters === null || distance(prevClusterCenters, clusterCenters) > epsilon)) {
        prevClusterCenters = clusterCenters;

        for (let i = 0; i < points.length; i++) {
            const distances = [];
            for (let j = 0; j < numClusters; j++) {
                distances.push(distance(points[i], clusterCenters[j]));
            }
            for (let j = 0; j < numClusters; j++) {
                let sum = 0;
                for (let k = 0; k < numClusters; k++) {
                    sum += Math.pow(distances[j] / distances[k], 2 / (fuzzyNum - 1));
                }
                memberships[i][j] = 1 / sum;
            }
        }

        clusterCenters = updateClusterCenters(points, memberships, numClusters,fuzzyNum);

        iteration++;
    }

    return { clusterCenters, memberships };
}

function drawClusters(ctx, points, memberships, colors) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const connectedPoints = {}; 

    let colorIndex = 0; 

    for (let i = 0; i < points.length; i++) {
        let maxMembership = 0;
        let maxIndex = 0;
        for (let j = 0; j < memberships[i].length; j++) {
            if (memberships[i][j] > maxMembership) {
                maxMembership = memberships[i][j];
                maxIndex = j;
            }
        }

        if (!connectedPoints[maxIndex]) {
            connectedPoints[maxIndex] = [];
        }
        connectedPoints[maxIndex].push(points[i]);
    }

    for (const clusterIndex in connectedPoints) {
        const clusterPoints = connectedPoints[clusterIndex];
        const color = colors[colorIndex % colors.length]; 
        ctx.strokeStyle = color;

        for (let i = 0; i < clusterPoints.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(clusterPoints[i].x, clusterPoints[i].y);
            ctx.lineTo(clusterPoints[i + 1].x, clusterPoints[i + 1].y);
            ctx.stroke();
        }

        if (clusterPoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(clusterPoints[clusterPoints.length - 1].x, clusterPoints[clusterPoints.length - 1].y);
            ctx.lineTo(clusterPoints[0].x, clusterPoints[0].y);
            ctx.stroke();
        }

        colorIndex++;
    }
}

function fCMeans(points,ctx, clusterCountCMeans, fuzzyNum, maxIterations,colors){
    const result = fuzzyCMeans(points, clusterCountCMeans, fuzzyNum, maxIterations);
    drawClusters(ctx, points, result.memberships,colors);
}

export {fCMeans};