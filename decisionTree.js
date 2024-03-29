function prob(clas, col) {
    let count = 0;
    for (let i = 0; i < col.length; i++) {
        if (clas == col[i]) {
            count++;
        }
    }
    return count / col.length;
}
function getClasses(col) {
    var classes = [];
    for (let i = 0; i < col.length; i++) {
        if (!classes.includes(col[i])) {
            classes.push(col[i]);
        }
    }
    return classes;
}
function entropy(col) {
    var entrop = 0;
    var classes = getClasses(col);
    for (let i = 0; i < classes.length; i++) {
        entrop -= prob(classes[i], col) * Math.log2(prob(classes[i], col));
    }
    return entrop;
}
function getCol(matrix,index) {
    var col = [];
    for (let i = 1; i < matrix.length; i++) {
        col.push(matrix[i][index]);
    }
    return col;
}
function getClassMatrix(indexCol, clas) {
    let classMatrix = [];
    classMatrix.push(data[0]);
    for (let i = 1; i < data.length; i++) {
        if (data[i][indexCol] == clas) {
            classMatrix.push(data[i]);
        }
    }
    return classMatrix;
}
function informationGain(col, index) {
    var classes = getClasses(col);
    var entrop = 0;
    for (let i = 0; i < classes.length; i++) {
        var proba = prob(classes[i], col);
        var classMatrix = getClassMatrix(index, classes[i]);
        var classEntropy = entropy(getCol(classMatrix, classMatrix[0].length - 1));
        entrop += proba * classEntropy;
    }
    var totalEntropy = entropy(getCol(data, data[0].length - 1));
    return totalEntropy - entrop;
}
function compare(a, b) {
    if (a.infGain > b.infGain){
        return -1;
    }
    else if (a.infGain < b.infGain){
        return 1;
    }
    else{
        return 0;
    }
}
function sortByInfGain() {
    var attributes = [];//получение атрибутов
    for (let i = 0; i < data[0].length - 1; i++) {
        attributes.push({name: data[0][i], colIndex: i, infGain: null});
    }
    for (let i = 0; i < data[0].length - 1; i++) {
        attributes[i].infGain=infGains[i];
    }
    attributes.sort(compare);
    return attributes;
}