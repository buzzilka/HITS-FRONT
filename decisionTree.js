class NodeID3 {
    constructor(name, attrBranch, attrVal) {
        this.name = name; 
        this.attrBranch = attrBranch;
        this.attrVal = attrVal;  
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
class NodeCART {
    constructor(indexForSearch, val, left, right) {
        this.val = val;
        this.leafVal = null;
        this.left = left;
        this.right = right;
        this.path = false;
        this.indexForSearch = indexForSearch;
    }
}

let data = [], depth, maxDepth, attrs, attrsForSearch;
let treeRootCART = new NodeCART;
let treeRootID3 = new NodeID3;

const leafAttr = new attrBranch("leaf", null, null);

let change = document.getElementById('separator').value;
function separator() {
  change = document.getElementById('separator').value;
}

function deleteDecisionTree(f=true){
    if (f) document.getElementById("userInput").value = "";

    data = [];
    reader = null;
    clear();
    document.getElementById("userInput").value = "";
    document.getElementById("findUserInput").value = "";
    document.getElementById("userInput").placeholder = "Введите обучающую выборку";
    document.getElementById("userInput").disabled = false;
    document.getElementById("fileInput").disabled = false;
    document.getElementsByName("alg")[0].disabled = false;
    document.getElementsByName("alg")[1].disabled = false;

   if (document.getElementsByName("alg")[1].checked){
        deleteDecisionTreeCART();
    }
    else{
        deleteDecisionTreeID3();
    }

}
function deleteDecisionTreeID3(){
    treeRootID3 = new NodeID3;
    clearPathID3(treeRootID3);
}
function deleteDecisionTreeCART(){
    treeRootCART = new NodeCART;
    clearPathCART(treeRootCART);
}

function readDataCART(lines){
    attrs = lines[0].split(change);
    attrsForSearch = lines[0].split(change);
    for (let i = 1; i < lines.length; i++)
    {
        if (lines[i] != ""){
            data.push(lines[i].split(change));
        }
    }
    if (data.length != 0){
        dataProcessing();
    }

}
function readDataID3(lines){
    for (let i = 0; i < lines.length; i++)
    {
        if (lines[i] != ""){
            data.push(lines[i].split(change));
        }
    }
}
let reader;
function fileInput(){
    const file = document.getElementById("fileInput");
    reader = new FileReader();
    if (file.files[0] != null){
        reader.readAsText(file.files[0]);
        reader.onload = function () {
            document.getElementById("userInput").value = "";
            document.getElementById("userInput").disabled = true;
            document.getElementById("userInput").placeholder = "Чтобы ввести данные, \nнажмите кнопку Очистить";
        }
        reader.error = function(){
            alert("error");
        }
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
function clearPathCART(curNode) {
    curNode.path = false;
    if (curNode.leafVal == null && document.getElementById("root").innerHTML != ""){
        clearPathCART(curNode.left);
        clearPathCART(curNode.right);
    }
}
function clearPathID3(curNode) {
    curNode.path = false;
    for (let i = 0; i < curNode.branches.length; i++) {
        clearPathID3(curNode.branches[i]);
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
function getClassesID3(col) {
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
    let classes = getClassesID3(col);
    for (let i = 0; i < classes.length; i++) {
        entrop -= prob(classes[i], col) * Math.log2(prob(classes[i], col));
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
    for (let i = 0; i < curData.length; i++) {
        if (curData[i][indexCol] == clas) {
            classMatrix.push(curData[i]);
        }
    }
    return classMatrix;
}
function informationGain(col, indexCol) {
    let classes = getClassesID3(col);
    let entrop = 0;
    if (col.length / classes.length < 1.5) {
        return -1;
    }
    for (let i = 0; i < classes.length; i++) {
        let proba = prob(classes[i], col);
        let classMatrix = getClassMatrix(indexCol, classes[i]);
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

function getClassesCART(curData, index) {
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

async function bypassDecisionTree(){
    if (document.getElementById("root").innerHTML == "") {
        alert("Постройте дерево")
    }
    else{
        const userData = document.getElementById("findUserInput").value.split(change);//данные для обхода
        if (document.getElementsByName("alg")[1].checked){
            let curNode = treeRootCART;//начало обхода
            clearPathCART(treeRootCART);
            while (curNode != null) {
                await new Promise(resolve => setTimeout(resolve, 100));
                curNode = findPathTreeCART(curNode, userData);   
            }
        }
        else{
            let curNode = treeRootID3;//начало обхода
            clearPathID3(treeRootID3);
            while (curNode != null) {
                await new Promise(resolve => setTimeout(resolve, 100));
                curNode = findPathTreeID3(curNode, userData);   
            }
        }
    }
}
function findPathTreeCART(curNode, userData) {
    let flag = false;//пометка для выхода из цикла, если пути не существует
    if (curNode == null) {//завершение
        return;
    }
    if (curNode == treeRootCART) {//проход через корень
        treeRootCART.path = true;//пометка вершины пути
        clear();
        displayCART(treeRootCART, document.getElementById("root"));
    }

    if (userData[curNode.indexForSearch] == curNode.val && (typeof(curNode.val) == "string") || 
    userData[curNode.indexForSearch] > curNode.val && (typeof(curNode.val) != "string")){
        curNode = curNode.left;//следующая вершина
        flag = true;

        curNode.path = true;//пометка вершины пути
        clear();
        displayCART(treeRootCART, document.getElementById("root"));
    }
    else {
        curNode = curNode.right;//следующая вершина
        flag = true;

        curNode.path = true;//пометка вершины пути
        clear();
        displayCART(treeRootCART, document.getElementById("root"));
    }
    
    if (curNode.leafVal == null && flag) {
        return curNode;//возврат следующей вершины
    }
    else {
        return null;//возврат для завершения
    }
}
function findPathTreeID3(curNode, userData) {
    let flag = false;//пометка для выхода из цикла, если пути не существует
    if (curNode == null) {//завершение
        return;
    }
    if (curNode == treeRootID3) {//проход через корень
        treeRootID3.path = true;//пометка вершины пути
        clear();
        displayID3(treeRootID3, document.getElementById("root"));
    }
    for (let i = 0; i < curNode.branches.length; i++) {
        if (userData[curNode.attrBranch.index] == curNode.branches[i].attrVal || curNode.branches.length == 1) {
            curNode = curNode.branches[i];//следующая вершина
            flag = true;

            curNode.path = true;//пометка вершины пути
            clear();
            displayID3(treeRootID3, document.getElementById("root"));

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

function displayCART(curNode, treeElement) {
    
    let newBranch = document.createElement("li");//создание ответвления от вершины
    let newBranchText = document.createElement("span");//элемент для текста
    if (curNode.leafVal == null) {//заполнение текста
        let sign = (typeof(curNode.val)=="string") ? '=' : '>';
        newBranchText.textContent = `${attrsForSearch[curNode.indexForSearch]} ${sign} ${curNode.val}`;
    } else {
        newBranchText.textContent = `${curNode.leafVal}`;
    }
    if (curNode.path) {//окраска пути обхода
        newBranchText.style.backgroundColor = '#01bdab';
    }
    newBranch.appendChild(newBranchText);//добавление текста в ответвление
    treeElement.appendChild(newBranch);//добавление ответвления
    if (curNode.leafVal != null) {//остановка на листе
        return;
    }
    const newNode = document.createElement("ul");//создание вершины
    newBranch.appendChild(newNode);//добавление вершины
    displayCART(curNode.left, newNode);
    displayCART(curNode.right, newNode);
}
function displayID3(curNode, treeElement) {
 
    let newBranch = document.createElement("li");//создание ответвления от вершины
    let newBranchText = document.createElement("span");//элемент для текста
    newBranchText.textContent = curNode.name;//заполнение текста
    if (curNode.path) {//окраска пути обхода
        newBranchText.style.backgroundColor = '#01bdab';
    }
    newBranch.appendChild(newBranchText);//добавление текста в ответвление
    treeElement.appendChild(newBranch);//добавление ответвления
    if (curNode.branches.length == 0) {//остановка на листе
        return;
    }
    const newNode = document.createElement("ul");//создание вершины
    newBranch.appendChild(newNode);//добавление вершины
    for (let i = 0; i < curNode.branches.length; i++) {
        displayID3(curNode.branches[i], newNode);
    }
}

function treeCuttingCART(curNode) {
    if (curNode.leafVal != null) {
        return curNode;
    }

    curNode.left = treeCuttingCART(curNode.left);
    curNode.right = treeCuttingCART(curNode.right);

    // если левый и правый листы равны, объединяем их
    if (curNode.left.leafVal != null && curNode.right.leafVal != null && curNode.left.leafVal == curNode.right.leafVal) {
        return curNode.left;
    }
    return curNode;
}
function treeCuttingID3(curNode) {
    if (curNode.branches.length == 1) {//возврат значения листа
        return [curNode.branches[0].attrVal];
    }

    let res = [];
    for (let i = 0; i < curNode.branches.length; i++) {
            let branchesAnswers = treeCuttingID3(curNode.branches[i]);
            for (let j = 0; j < branchesAnswers.length; j++) {
                res.push(branchesAnswers[j]);//нахождение значений листьев вершины
            }
    }

    if (getClassesID3(res).length == 1) {//сокращение вершины если значения листьев одинаковые
        curNode.branches = [curNode.branches[0].branches[0]];
    }

    return res;
}

function getSplit(curData) {//поиск самого удачного разделения данных по индексу Джини
    let newNode, minGini;
    for (let index = 0; index < curData[0].length - 1; index++) {
        let classes = getClassesCART(curData, index);//возможные варианты разделения по значению из столбца
        for (let i = 0; i < classes.length; i++){
            let groups = groupSplit(index, classes[i], curData);//разделения по значению из столбца
            let gini = giniIndex(groups);//расчет индекса
            if (gini < minGini || minGini == null) {//подбор наилучшего результата
                newNode = new NodeCART(attrsForSearch.indexOf(attrs[index]),classes[i], groups[0], groups[1]);
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

function getBranchesID3(queue, attributes) {
    let curIndex = 1;//индекс добавляемой вершины
    while (queue.length != 0 && curIndex < attributes.length) {
        let curNode = queue.shift();//извлечение вершины
        let branches = sortBranches(curNode.attrBranch.index);//ответвления от вершины

        if (attributes.length - curIndex < branches.length || depth >= maxDepth - 2) {//обозначение листьев || depth >= maxDepth - 2
            let count = branches.length - attributes.length + curIndex;
            for (let i = 0; i < count; i++) {
                attributes.push(leafAttr);
            }
        }
        if (depth < maxDepth - 2)
        {
            for (let i = 0; i < branches.length; i++) {//добавление веток к вершине
                if (curIndex < attributes.length) {
                    curNode.branches.push(new NodeID3(`${curNode.attrBranch.nameAttr} = ${branches[i]}`, attributes[curIndex], branches[i]));
                    queue.push(curNode.branches[i]);
                    curIndex++;
                }
            }
            depth++;
        }
    }
}
function sortBranches(colIndex) {
    let branches = getClassesID3(getCol(data, colIndex));//возможные ответвления
    let count = [];

    for (let i = 0; i < branches.length; i++) {
        count.push(getClassMatrix(colIndex, branches[i]).length);//количество вхождений значения ветки
    }

    return quickSort(count, branches, 0, count.length - 1);
}
function getLeaves(curNode, curData) {
    if (curNode.branches.length != 0) {//поиск листьев
        for (let i = 0; i < curNode.branches.length; i++) {
 
            let newData = getClassMatrix(curNode.attrBranch.index,curNode.branches[i].attrVal); 
            
            getLeaves(curNode.branches[i], newData);//продолжение добавление листьев
        }
    }
    else {//добавление листьев
        let beforeLeaf = getClassesID3(getCol(data, curNode.attrBranch.index));//возможные варианты прохода до листа
        for (let i = 0; i < beforeLeaf.length; i++) {
            if (curNode.attrBranch != leafAttr && depth < maxDepth - 1){
                curNode.branches.push(new NodeID3(`${curNode.attrBranch.nameAttr} = ${beforeLeaf[i]}`, 
                curNode.attrBranch, beforeLeaf[i]));

                curNode.branches[i].branches.push(new NodeID3(`${data[0][data[0].length - 1]} = 
                ${getResults(curNode.attrBranch, beforeLeaf[i], curData)}`, null, 
                getResults(curNode.attrBranch, beforeLeaf[i], curData)));//лист
            }
            else{
                curNode.branches.push(new NodeID3(`${data[0][data[0].length - 1]} = 
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

    let answers = getClassesID3(getCol(curData, curData[0].length - 1, 0));
    let count = [];
    for (let i = 0; i < answers.length; i++) {//нахождение количества ответов по заданному атрибуту
        count.push(getClassMatrix(curData[0].length - 1, answers[i], getClassMatrix(attr.index, beforeLeaf, curData)).length);
    }
    //return Math.max.apply(null,count) == Math.min.apply(null,count) && count.length != 1 || Math.max.apply(null,count) == 0? 
    //"unknown" : answers[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
    return Math.max.apply(null,count) == 0? "unknown" : answers[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
}

function getBranchesCART(curNode, depth) {
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
        getBranchesCART(curNode.left, depth + 1); 
    }
    if (curNode.right.length == 1) {
        curNode.right = getLeaf(curNode.right);//3.если в ветке остался один вариант
    } else {//иначе создаём ветку
        curNode.right = getSplit(curNode.right);
        getBranchesCART(curNode.right, depth + 1);
    }
}
function getLeaf(curData) {
    let res = getRes(curData);
    let sign = "=";
    let classesRes = getClassesRes([curData]);
    let count = new Array (classesRes.length).fill(0);
    for (let i = 0; i < classesRes.length; i++){//нахождение количества ответов
        for (let j = 0; j < res.length; j++){
            if ((isNaN(parseFloat(data[0][data[0].length - 1])) || classesRes.length == 1 || getClassesRes(data).length <= 3) && res[j] == classesRes[i]){
                count[i]++;
            }
            else if (!isNaN(parseFloat(data[0][data[0].length - 1])) && classesRes.length != 1 && getClassesRes(data).length > 3 && res[j] > classesRes[i]){
                count[i]++;
                sign = ">";
            }
        }
    }
    let leaf = new NodeCART();
    //leaf.leafVal = Math.max.apply(null,count) == Math.min.apply(null,count) && count.length != 1 || Math.max.apply(null,count) == 0? 
    //"unknown" : classesRes[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
    leaf.leafVal = Math.max.apply(null,count) == 0?
    `${attrs[attrs.length - 1]} = unknown `: `${attrs[attrs.length - 1]} ${sign} ${classesRes[count.indexOf(Math.max.apply(null,count))]}`;//самый частовстречающийся ответ
    return leaf;
}

function buildDecisionTree(){
    if (document.getElementsByName("alg")[1].checked){
        document.getElementsByName("alg")[0].disabled = true;
        buildDecisionTreeCART();
    }
    else{
        document.getElementsByName("alg")[1].disabled = true;
        buildDecisionTreeID3();
    }  
}
function buildDecisionTreeCART(){
    data = [];
    if (reader != null){
        let lines = reader.result.split('\r\n');
        readDataCART(lines);
    }
    if (data.length <= 1 || data[0].length <= 1){
        if(document.getElementById("userInput").value != ""){
            data = [];
            readDataCART(document.getElementById("userInput").value.split("\n"));
            if (data.length > 1 && data[0].length > 1){
                document.getElementById("fileInput").disabled = true;
            }
        }
    }
    if (data.length <= 1 || data[0].length <= 1){
        alert("Некорректные данные");
        deleteDecisionTree(false);
    }
    else{
        depth = 1;
        maxDepth = document.getElementById('maxDepth').value;

        treeRootCART = new NodeCART();
        clear();//очистка поля
        clearPathCART(treeRootCART); //очистка пути обхода

        treeRootCART = getSplit(data);//построение
        getBranchesCART(treeRootCART, depth);

        treeCuttingCART(treeRootCART);
        displayCART(treeRootCART, document.getElementById("root"));//отображение
    }
}
function buildDecisionTreeID3(){
    function make() {
        let attributes = sortAttributes();//сортировка атрибутов
        if (attributes.length == 0){
            alert("Некорректные данные");
            deleteDecisionTree(false);
            return null;
        }
        else{
            let root = new NodeID3("root", attributes[0], "root");//корень
            let queue = [root];//очередь вершин с корнем
            getBranchesID3(queue, attributes);//ветки
            getLeaves(root, data);//листья
    
            return root;
        }
    }

    data = [];
    if (reader != null){
        let lines = reader.result.split('\r\n');
        readDataID3(lines);
    }
    if (data.length <= 1 || data[0].length <= 1){
        if(document.getElementById("userInput").value != ""){
            data = [];
            readDataID3(document.getElementById("userInput").value.split("\n"));
            if (data.length > 1 && data[0].length > 1){
                document.getElementById("fileInput").disabled = true;
            }
        }
    }
    if (data.length <= 1 || data[0].length <= 1){
        alert("Некорректные данные");
        deleteDecisionTree(false);
    }
    else{
        depth = 1;
        maxDepth = document.getElementById('maxDepth').value;

        treeRootID3 = new NodeID3();
        clear();//очистка поля
        clearPathID3(treeRootID3); //очистка пути обхода

        treeRootID3 = make();//построение
        if (treeRootID3 != null){
            treeCuttingID3(treeRootID3);//сокращение дерева
            displayID3(treeRootID3, document.getElementById("root"));//отображение
        }
    }
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