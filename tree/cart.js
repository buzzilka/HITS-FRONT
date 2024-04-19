export{deleteDecisionTreeCART, readDataCART, buildDecisionTreeCART, bypassDecisionTreeCART, NodeCART, attrsForSearch, attrs};
import {change, data, depth, maxDepth, clear} from "../tree/main.js";
import { getRes, getSplit} from "../tree/carthelp.js";

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

let attrs, attrsForSearch;
let treeRootCART = new NodeCART;

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
        for (let row of data){
            if (!isNaN(parseFloat(row[i]))){
                row[i]=parseFloat(row[i]);//перевод строки в число
            }
            if ((typeof(row[i]) === "string") && row[i] != ""){//проверка на тип данных в столбце
                areNums = false;
            }
            if (!unique.includes(row[i]) || row[i] === "") {//проверка на неудачные для разделения атрибуты
                unique.push(row[i]);
            }
        }
        if (!areNums || new Set(unique).size <= 4) {
            for (let row of data){
                row[i] = row[i].toString();//перевод дынных столбца в один тип
            }
        }
        //удаление неудачных для разделения атрибутов
        if (data.length / unique.length < 1.5 && ((typeof(unique[0]) === "string") || numberingCheck(unique))){
            for (let str of data){
                str.splice(i,1);
            }
            attrs.splice(i,1);
            i--;
        }
    }
}

function buildDecisionTreeCART(){
    treeRootCART = new NodeCART();
    clearPathCART(treeRootCART); //очистка пути обхода

    treeRootCART = getSplit(data);//построение
    getBranchesCART(treeRootCART, depth);

    treeCuttingCART(treeRootCART);
    displayCART(treeRootCART, document.getElementById("root"));//отображение
}

function displayCART(curNode, treeElement) {
    
    let newBranch = document.createElement("li");//создание ответвления от вершины
    let newBranchText = document.createElement("span");//элемент для текста
    if (curNode.leafVal == null) {//заполнение текста
        let sign = (typeof(curNode.val) === "string") ? '=' : '>';
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

function getBranchesCART(curNode, depth) {
    //создаём лист, если
    if (curNode.left.length === 0 || curNode.right.length === 0) {//1. у одной из веток нет данных
        let leaf = getLeaf(curNode.left.length === 0? curNode.right : curNode.left);
        curNode.left = leaf;
        curNode.right = leaf;
        return;
    }
    if (depth >= maxDepth - 1) {//2. максимальная глубина
        curNode.left = getLeaf(curNode.left);
        curNode.right = getLeaf(curNode.right);
        return;
    }
    if (curNode.left.length === 1) {
        curNode.left = getLeaf(curNode.left);//3.если в ветке остался один вариант
    } else {//иначе создаём ветку
        curNode.left = getSplit(curNode.left);
        getBranchesCART(curNode.left, depth + 1); 
    }
    if (curNode.right.length === 1) {
        curNode.right = getLeaf(curNode.right);//3.если в ветке остался один вариант
    } else {//иначе создаём ветку
        curNode.right = getSplit(curNode.right);
        getBranchesCART(curNode.right, depth + 1);
    }
}
function getLeaf(curData) {
    let res = getRes(curData);
    let sign = "=";
    let classesRes = new Set(getRes(curData));
    classesRes = Array.from(classesRes);
    let count = new Array (classesRes.length).fill(0);
    for (let i in classesRes){//нахождение количества ответов
        for (let result of res){
            if ((isNaN(parseFloat(data[0][data[0].length - 1])) || classesRes.length === 1 || new Set(getRes(data)).size <= 3) && result === classesRes[i]){
                count[i]++;
            }
            else if (!isNaN(parseFloat(data[0][data[0].length - 1])) && classesRes.length != 1 && new Set(getRes(data)).size > 3 && result > classesRes[i]){
                count[i]++;
                sign = ">";
            }
        }
    }
    let leaf = new NodeCART();
    //leaf.leafVal = Math.max.apply(null,count) === Math.min.apply(null,count) && count.length != 1 || Math.max.apply(null,count) === 0? 
    //"unknown" : classesRes[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
    leaf.leafVal = Math.max.apply(null,count) === 0?
    `${attrs[attrs.length - 1]} = unknown `: `${attrs[attrs.length - 1]} ${sign} ${classesRes[count.indexOf(Math.max.apply(null,count))]}`;//самый частовстречающийся ответ
    return leaf;
}
function treeCuttingCART(curNode) {
    if (curNode.leafVal != null) {
        return curNode;
    }

    curNode.left = treeCuttingCART(curNode.left);
    curNode.right = treeCuttingCART(curNode.right);

    // если левый и правый листы равны, объединяем их
    if (curNode.left.leafVal != null && curNode.right.leafVal != null && curNode.left.leafVal === curNode.right.leafVal) {
        return curNode.left;
    }
    return curNode;
}

async function bypassDecisionTreeCART(userData){
    let curNode = treeRootCART;//начало обхода
    clearPathCART(treeRootCART);
    while (curNode != null) {
        await new Promise(resolve => setTimeout(resolve, 100));
        curNode = findPathTreeCART(curNode, userData);   
    }
};
function findPathTreeCART(curNode, userData) {
    let flag = false;//пометка для выхода из цикла, если пути не существует
    if (curNode == null) {//завершение
        return;
    }
    if (curNode === treeRootCART) {//проход через корень
        treeRootCART.path = true;//пометка вершины пути
        clear();
        displayCART(treeRootCART, document.getElementById("root"));
    }

    if (userData[curNode.indexForSearch] === curNode.val && (typeof(curNode.val) === "string") || 
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

function deleteDecisionTreeCART(){
    treeRootCART = new NodeCART;
    clearPathCART(treeRootCART);
}
function clearPathCART(curNode) {
    curNode.path = false;
    if (curNode.leafVal == null && document.getElementById("root").innerHTML != ""){
        clearPathCART(curNode.left);
        clearPathCART(curNode.right);
    }
}


