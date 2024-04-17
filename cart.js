class Node {
    constructor(indexForSearch, val, left, right) {
        this.val = val;
        this.leafVal = null;
        this.left = left;
        this.right = right;
        this.path = false;
        this.indexForSearch = indexForSearch;
    }
}
let data, depth, maxDepth, attrs, attrsForSearch;
let treeRoot = new Node;

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
        clear();
        clearPath(treeRoot);

        let lines = reader.result.split('\r\n');
        attrs = lines[0].split(change);
        attrsForSearch = lines[0].split(change);
        data = new Array(lines.length - 2);
        for (let i = 1; i < lines.length - 1; i++)
        {
            data[i - 1] = lines[i].split(change);
        }
        dataProcessing();
    }
    reader.error = function(){
        alert("error");
    }
}
function dataProcessing(){
    function numberingCheck(unique){//проверка на последовательность
        for (let i = 0; i < unique.length - 2; i++){
            if (unique[i+2] - unique[i+1] != unique[i+1] - unique[i]){
                return false;
            }
        }
        return true;
    }

    let i = 0;
    for (i; i < data[0].length - 1; i++) {
        let areNums = true;
        let unique = [];
        for (let j = 0; j < data.length; j++){
            if (!isNaN(parseFloat(data[j][i]))){
                data[j][i]=parseFloat(data[j][i]);//перевод строки в число
            }
            if ((typeof(data[j][i]) == "string") && data[j][i] != ""){//проверка на тип данных в столбце
                areNums = false;
            }
            if (!unique.includes(data[j][i]) || data[j][i]=="") {//проверка на неудачные для разделения атрибуты
                unique.push(data[j][i]);
            }
        }
        if (!areNums) {
            for (let j = 0; j < data.length; j++){
                data[j][i] = data[j][i].toString();//перевод дынных столбца в один тип
            }
        }
        //удаление неудачных для разделения атрибутов
        if (data.length / unique.length < 1.5 && ((typeof(unique[0]) == "string") || numberingCheck(unique))){
            for (let j = 0; j < data.length; j++){
                data[j].splice(i,1);
            }
            attrs.splice(i,1);
            i--;
        }
    }
}

function clear() {
    document.getElementById("root").innerHTML = "";
}
function clearPath(curNode) {
    curNode.path = false;
    if (curNode.leafVal == null && document.getElementById("root").innerHTML != ""){
        clearPath(curNode.left);
        clearPath(curNode.right);
    }
}

function getClasses(curData, index) {
    let classes = [];
    for (let i = 0; i < curData.length; i++) {
        if (!classes.includes(curData[i][index]) && curData[i][index] != "") {
            classes.push(curData[i][index]);
        }
    }
    return classes;
}
function getRes(curData) {
    let ans = [];
    for (let i = 0; i < curData.length; i++){
        ans.push(curData[i][curData[0].length - 1]);
    }
    return ans;
}
function getClassesRes(groups) {
    let classes = [];
    for (let i = 0; i < groups.length; i++) {
        let classesRes = getRes(groups[i]);
        for (let j = 0; j < classesRes.length; j++){
            if (!classes.includes(classesRes[j])) {
                classes.push(classesRes[j]);
            }
        }
    }
    return classes;
}
function countGroupElements(groups) {
    let count = 0;
    for (let i = 0; i < groups.length; i++) {
        count += groups[i].length;
    }
    return count;
}
function getProportion(curData, clas) {
    let count = 0;
    for (let i = 0; i < curData.length; i++) {
        if (clas == curData[i][curData[0].length - 1]) {
            count++;
        }
    }
    return count / curData.length;
}

function buildDecisionTree(){
    if (data == null || data.length == 1){
        alert("Некорректные данные")
    }
    else{
        depth = 1;
        maxDepth = document.getElementById('maxDepth').value;

        clear();//очистка поля
        clearPath(treeRoot); //очистка пути обхода

        treeRoot = getSplit(data);//построение
        getBranches(treeRoot, depth);

        treeCutting(treeRoot);
        display(treeRoot, document.getElementById("root"));//отображение
    }
}
function display(curNode, treeElement) {
    
    let newBranch = document.createElement("li");//создание ответвления от вершины
    let newBranchText = document.createElement("span");//элемент для текста
    newBranchText.style.backgroundColor = 'white';
    if (curNode.leafVal == null) {//заполнение текста
        let sign = (typeof(curNode.val)=="string") ? '=' : '>';
        newBranchText.textContent = `${attrsForSearch[curNode.indexForSearch]} ${sign} ${curNode.val}`;
    } else {
        newBranchText.textContent = `${curNode.leafVal}`;
    }
    if (curNode.path) {//окраска пути обхода
        newBranchText.style.backgroundColor = "SkyBlue";
    }
    newBranch.appendChild(newBranchText);//добавление текста в ответвление
    treeElement.appendChild(newBranch);//добавление ответвления
    if (curNode.leafVal != null) {//остановка на листе
        return;
    }
    const newNode = document.createElement("ul");//создание вершины
    newBranch.appendChild(newNode);//добавление вершины
    display(curNode.left, newNode);
    display(curNode.right, newNode);
}

function getSplit(curData) {//поиск самого удачного разделения данных по индексу Джини
    let newNode, minGini;
    for (let index = 0; index < curData[0].length - 1; index++) {
        let classes = getClasses(curData, index);//возможные варианты разделения по значению из столбца
        for (let i = 0; i < classes.length; i++){
            let groups = groupSplit(index, classes[i], curData);//разделения по значению из столбца
            let gini = giniIndex(groups);//расчет индекса
            if (gini < minGini || minGini == null) {//подбор наилучшего результата
                newNode = new Node(attrsForSearch.indexOf(attrs[index]),classes[i], groups[0], groups[1]);
                minGini = gini;
            }
        }
    }
    return newNode;
}
function giniIndex(groups) {
    let gini = 0;
    let classesRes = getClassesRes(groups);
    let groupsLength = countGroupElements(groups);
    
    for (let i = 0; i < groups.length; i++){
        if (groups[i].length == 0) return;
        let allSum = 0;
        for (let j = 0; j < classesRes.length; j++){
            let proportion = getProportion(groups[i], classesRes[j]);
            allSum += (proportion*proportion);
        }
        gini += (1 - allSum) * (groups[i].length / groupsLength);
    }

    return gini;
}
function groupSplit(colIndex, clas, curData) {
    let left = [], right = [];
    for (let i = 0; i < curData.length; i++){
        if ((typeof(curData[i][colIndex]) == "string") &&  clas == curData[i][colIndex] ||
        (typeof(curData[i][colIndex]) != "string") && curData[i][colIndex] > clas) {//если элемент подходит критерию - влево
            left.push(curData[i]);
        } else if (curData[i][colIndex] != ""){// иначе - вправо
            right.push(curData[i]);
        }
    }
    return [left, right];
}

function getBranches(curNode, depth) {
    //создаём лист, если
    if (curNode.left.length == 0 || curNode.right.length == 0) {//1. у одной из веток нет данных
        let leaf = getLeaf(curNode.left.length == 0? curNode.right : curNode.left);
        curNode.left = leaf;
        curNode.right = leaf;
        return;
    }
    if (depth >= maxDepth - 1) {//2. максимальная глубина
        curNode.left = getLeaf(curNode.left);
        curNode.right = getLeaf(curNode.right);
        return;
    }
    if (curNode.left.length == 1) {
        curNode.left = getLeaf(curNode.left);//3.если в ветке остался один вариант
    } else {//иначе создаём ветку
        curNode.left = getSplit(curNode.left);
        getBranches(curNode.left, depth + 1); 
    }
    if (curNode.right.length == 1) {
        curNode.right = getLeaf(curNode.right);//3.если в ветке остался один вариант
    } else {//иначе создаём ветку
        curNode.right = getSplit(curNode.right);
        getBranches(curNode.right, depth + 1);
    }
}
function getLeaf(curData) {
    let res = getRes(curData);
    let classesRes = getClassesRes([curData]);
    let count = new Array (classesRes.length).fill(0);
    for (let i = 0; i < classesRes.length; i++){//нахождение количества ответов
        for (let j = 0; j < res.length; j++){
            if (res[j] == classesRes[i]){
                count[i]++;
            }
        }
    }
    let leaf = new Node();
    //leaf.leafVal = Math.max.apply(null,count) == Math.min.apply(null,count) && count.length != 1 || Math.max.apply(null,count) == 0? 
    //"unknown" : classesRes[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
    leaf.leafVal = Math.max.apply(null,count) == 0? "unknown" : classesRes[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
    return leaf;
}
function treeCutting(curNode) {
    if (curNode.leafVal != null) {
        return curNode;
    }

    curNode.left = treeCutting(curNode.left);
    curNode.right = treeCutting(curNode.right);

    // если левый и правый листы равны, объединяем их
    if (curNode.left.leafVal != null && curNode.right.leafVal != null && curNode.left.leafVal == curNode.right.leafVal) {
        return curNode.left;
    }
    return curNode;
}

async function bypassDecisionTree(){
    if (document.getElementById("root").innerHTML == "") {
        alert("Постройте дерево")
    }
    else{
        const userData = document.getElementById("userInput").value.split(change);//данные для обхода
        let curNode = treeRoot;//начало обхода
        clearPath(treeRoot);
        if (userData != ""){
            while (curNode != null) {
                await new Promise(resolve => setTimeout(resolve, 100));
                curNode = findPathTree(curNode, userData);
            }
        }
        else{
            alert("Нет данных");
        }
    }
};
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

    if (userData[curNode.indexForSearch] == curNode.val && (typeof(curNode.val) == "string") || 
    userData[curNode.indexForSearch] > curNode.val && (typeof(curNode.val) != "string")){
        curNode = curNode.left;//следующая вершина
        flag = true;

        curNode.path = true;//пометка вершины пути
        clear();
        display(treeRoot, document.getElementById("root"));
    }
    else {
        curNode = curNode.right;//следующая вершина
        flag = true;

        curNode.path = true;//пометка вершины пути
        clear();
        display(treeRoot, document.getElementById("root"));
    }
    
    if (curNode.leafVal == null && flag) {
        return curNode;//возврат следующей вершины
    }
    else {
        return null;//возврат для завершения
    }
}


