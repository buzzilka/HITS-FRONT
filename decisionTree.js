class Node {
    constructor(name, attrBranch, attrBranchVal) {
        this.name = name; 
        this.attrBranch = attrBranch;
        this.attrBranchVal = attrBranchVal;  
        this.branches = [];        
        this.path = false;
    }
}
class attrBranch {
    constructor(nameAttr, index, infGain) {
        this.nameAttr = nameAttr; 
        this.index = index;
        this.infGain = infGain;  
    }
}

let data, treeRoot;
treeRoot = new Node;
treeRoot.branches = 0;
const leafAttr = new attrBranch("leaf", null, null);

let change = document.getElementById('separator').value;
function separator() {
  change = document.getElementById('separator').value;
}
function fileInput(){
    const file = document.getElementById("fileInput");
    let reader = new FileReader();
    reader.readAsText(file.files[0]);
    reader.onload = function () {
        treeRoot = new Node;
        treeRoot.branches = 0;
        clear();
        clearPath(treeRoot);

        let lines = reader.result.split('\r\n');
        data=new Array(lines.length - 1);
        for (let i = 0; i < lines.length - 1; i++)
        {
            data[i] = lines[i].split(change);
        }
    }
    reader.error = function(){
        alert("error");
    }
}

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
    let classes = [];
    for (let i = 0; i < col.length; i++) {
        if (!classes.includes(col[i])) {
            classes.push(col[i]);
        }
    }
    return classes;
}
function entropy(col) {
    let entrop = 0;
    let classes = getClasses(col);
    for (let i = 0; i < classes.length; i++) {
        entrop -= prob(classes[i], col) * Math.log2(prob(classes[i], col));
    }
    return entrop;
}
function getCol(curData, indexCol) {
    let col = [];
    for (let i = 1; i < curData.length; i++) {
        col.push(curData[i][indexCol]);
    }
    return col;
}
function getClassMatrix(indexCol, clas, curData = data) {
    let classMatrix = [];
    classMatrix.push(curData[0]);
    for (let i = 1; i < curData.length; i++) {
        if (curData[i][indexCol] == clas) {
            classMatrix.push(curData[i]);
        }
    }
    return classMatrix;
}
function informationGain(col, indexCol) {
    let classes = getClasses(col);
    let entrop = 0;
    for (let i = 0; i < classes.length; i++) {
        let proba = prob(classes[i], col);
        let classMatrix = getClassMatrix(indexCol, classes[i]);
        let classEntropy = entropy(getCol(classMatrix, classMatrix[0].length - 1));
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
        attributes.push(new attrBranch(data[0][i],i,informationGain(getCol(data,i),i)));
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

function clear() {
    document.getElementById("root").innerHTML = "";
}
function clearPath(curNode) {
    curNode.path = false;
    for (let i = 0; i < curNode.branches.length; i++) {
        clearPath(curNode.branches[i]);
    }
}

function buildDecisionTree(){
    if (data==null){
        alert("Нет данных")
    }
    else{
        clear();//очистка поля
        clearPath(treeRoot); //очистка пути обхода

        treeRoot = make();//построение
        display(treeRoot, document.getElementById("root"));//отображение
    }
}
function optimizeDecisionTree(){
    if (treeRoot.branches==0) {
        alert("Постройте дерево")
    }
    else{
        clear();//очистка поля
        clearPath(treeRoot);//очистка пути обхода

        treeCutting(treeRoot);//сокращение дерева
        display(treeRoot, document.getElementById("root"));//отображение
    }
}
async function bypassDecisionTree(){
    if (treeRoot.branches==0) {
        alert("Постройте дерево")
    }
    else{
        const userData = document.getElementById("userInput").value.split(";");//данные для обхода
        let curNode = treeRoot;//начало обхода
        clearPath(treeRoot);
        while (curNode != null) {
            await new Promise(resolve => setTimeout(resolve, 100));
            curNode = findPathTree(curNode, userData);
        }
    }
};

function make() {
    let attributes = sortAttributes();//сортировка атрибутов
    let root = new Node("root", attributes[0], "root");//корень
    let queue = [root];//очередь вершин с корнем
    getBranches(queue, attributes);//ветки
    getLeaves(root, data);//листья

    return root;
}
function display(curNode, treeElement) {
 
    let newBranch = document.createElement("li");//создание ответвления от вершины
    let newBranchText = document.createElement("span");//элемент для текста
    newBranchText.style.backgroundColor = 'white';
    newBranchText.textContent = curNode.name;//заполнение текста
    if (curNode.path) {//окраска пути обхода
        newBranchText.style.backgroundColor = "SkyBlue";
    }
    newBranch.appendChild(newBranchText);//добавление текста в ответвление
    treeElement.appendChild(newBranch);//добавление ответвления
    if (curNode.branches.length == 0) {//остановка на листе
        return;
    }
    const newNode = document.createElement("ul");//создание вершины
    newBranch.appendChild(newNode);//добавление вершины
    for (let i = 0; i < curNode.branches.length; i++) {
        display(curNode.branches[i], newNode);
    }
}

function getBranches(queue, attributes) {
    let curIndex = 1;//индекс добавляемой вершины
    while (queue.length != 0 && curIndex < attributes.length) {
        let curNode = queue.shift();//извлечение вершины
        let branches = sortBranches(curNode.attrBranch.index);//ответвления от вершины

        if (attributes.length - curIndex < branches.length) {//обозначение листьев
            for (let i = 0; i < branches.length - attributes.length + curIndex; i++) {
                attributes.push(leafAttr);
            }
        }

        for (let i = 0; i < branches.length; i++) {//добавление веток к вершине
            if (curIndex < attributes.length) {
                curNode.branches.push(new Node(`${curNode.attrBranch.nameAttr} = ${branches[i]}`, attributes[curIndex], branches[i]));
                queue.push(curNode.branches[i]);
                curIndex++;
            }
        }
    }
}
function sortBranches(colIndex) {
    let branches = getClasses(getCol(data,colIndex));//возможные ответвления
    let count = [];

    for (let i = 0; i < branches.length; i++) {
        count.push(getClassMatrix(colIndex, branches[i]).length - 1);//количество вхождений значения ветки
    }

    return quickSort(count, branches, 0, count.length - 1);
}
function getLeaves(curNode, curData) {
    if (curNode.branches.length != 0) {//поиск листьев
        for (let i = 0; i < curNode.branches.length; i++) {
 
            let newData = getClassMatrix(curNode.attrBranch.index,curNode.branches[i].attrBranchVal); 
            newData.splice(0, 1);//матрица с уникальным атрибутом для подсчета результатов
            
            getLeaves(curNode.branches[i], newData);//продолжение добавление листьев
        }
    }
    else {//добавление листьев
        let beforeLeaf = getClasses(getCol(data, curNode.attrBranch.index));//возможные варианты прохода до листа
        for (let i = 0; i < beforeLeaf.length; i++) {
            if (curNode.attrBranch != leafAttr){
                curNode.branches.push(new Node(`${curNode.attrBranch.nameAttr} = ${beforeLeaf[i]}`, 
                curNode.attrBranch, beforeLeaf[i]));

                curNode.branches[i].branches.push(new Node(`${data[0][data[0].length - 1]} = 
                ${getResults(curNode.attrBranch, beforeLeaf[i], curData)}`, null, 
                getResults(curNode.attrBranch, beforeLeaf[i], curData)));//лист
            }
            else{
                curNode.branches.push(new Node(`${data[0][data[0].length - 1]} = 
                ${getResults(curNode.attrBranch, beforeLeaf[i], curData)}`, null, 
                getResults(curNode.attrBranch, beforeLeaf[i], curData)));//лист
            }
        }
    }
}
function getResults(attr, beforeLeaf, curData) {
    if (curData.length == 0) {//отсутствие информации
        return "unknown";
    }

    let answers = getClasses(getCol(curData, curData[0].length - 1));
    let count = [];
    for (let i = 0; i < answers.length; i++) {//нахождение количества ответов по заданному атрибуту
        count.push(getClassMatrix(curData[0].length - 1, answers[i], getClassMatrix(attr.index, beforeLeaf, curData)).length);
    }
    
    return answers[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
}

function findPathTree(curNode, userData) {
    let flag = false;//пометка для выхода из цикла, если пути не существует
    if (curNode == null) {//завершение
        return;
    }
    if (curNode == treeRoot) {//проход через корень
        treeRoot.path = true;//пометка вершины пути
        clear();
        display(treeRoot, document.getElementById("root"));
    }
    for (let i = 0; i < curNode.branches.length; i++) {
        if (userData[curNode.attrBranch.index] == curNode.branches[i].attrBranchVal || curNode.branches.length == 1) {
            curNode = curNode.branches[i];//следующая вершина
            flag = true;

            curNode.path = true;//пометка вершины пути
            clear();
            display(treeRoot, document.getElementById("root"));

            break;
        }
    }
    if (curNode.branches.length > 0 && flag) {
        return curNode;//возврат следующей вершины
    }
    else {
        return null;//возврат для завершения
    }
}
function treeCutting(curNode) {
    if (curNode.branches.length == 1) {//возврат значения листа
        return [curNode.branches[0].attrBranchVal];
    }

    let res = [];
    for (let i = 0; i < curNode.branches.length; i++) {
            let branchesAnswers = treeCutting(curNode.branches[i]);
            for (let j = 0; j < branchesAnswers.length; j++) {
                res.push(branchesAnswers[j]);//нахождение значений листьев вершины
            }
    }

    if (getClasses(res).length == 1) {//сокращение вершины если значения листьев одинаковые
        curNode.branches = [curNode.branches[0].branches[0]];
    }

    return res;
}

let audio = document.getElementById('audio');
function play() {
    audio.play();
}
function pause() {
    audio.pause();
}
function volume(){
    audio.volume = Math.random();
}

