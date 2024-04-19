import {data} from "../tree/main.js";
import {attrBranch} from "../tree/id3.js";
export{getClassMatrix, getCol, sortAttributes, quickSort}

function prob(clas, col) {
    let count = 0;
    for (let elem of col) {
        if (clas === elem) {
            count++;
        }
    }
    return count / col.length;
}

function entropy(col) {
    let entrop = 0;
    let classes = new Set(col);
    for (let clas of classes) {
        entrop -= prob(clas, col) * Math.log2(prob(clas, col));
    }
    return entrop;
}
function getCol(curData, indexCol, i = 1) {
    let col = [];
    for (i; i < curData.length; i++) {
        col.push(curData[i][indexCol]);
    }
    return col;
}
function getClassMatrix(indexCol, clas, curData = data) {
    let classMatrix = [];
    for (let row of curData) {
        if (row[indexCol] === clas) {
            classMatrix.push(row);
        }
    }
    return classMatrix;
}
function informationGain(col, indexCol) {
    let classes = new Set(col);
    let entrop = 0;
    if (col.length / classes.size < 1.5) {
        return -1;
    }
    for (let clas of classes) {
        let proba = prob(clas, col);
        let classMatrix = getClassMatrix(indexCol, clas);
        let classEntropy = entropy(getCol(classMatrix, classMatrix[0].length - 1, 0));
        entrop += proba * classEntropy;
    }
    let totalEntropy = entropy(getCol(data, data[0].length - 1));
    return totalEntropy - entrop;
}

function sortAttributes() {
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
    
    let attributes = [];
    for (let i = 0; i < data[0].length - 1; i++) {
        if (informationGain(getCol(data, i),i) != -1){
            attributes.push(new attrBranch(data[0][i], i, informationGain(getCol(data, i),i)));
        }
    }
    return attributes.sort(compare);
}

function quickSort(arr, arr2, beg, end)
{
	let p, i, j;
	i = beg; j = end;
	p = (arr[i] + arr[(i + j) / 2] + arr[j]) / 3;
	while (i < j)
	{
		while (arr[i] > p && i < end) i++;
		while (arr[j] < p && j > beg) j--;
		if (i <= j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            [arr2[i], arr2[j]] = [arr2[j], arr2[i]];

			i++; j--;
		}
	}
	if (beg < j ) quickSort(arr, beg, j);
	if (i < end) quickSort(arr, i, end);
    return arr2;
}