export{deleteDecisionTreeID3, readDataID3, buildDecisionTreeID3, bypassDecisionTreeID3, attrBranch};
import {change, data, depth, maxDepth, clear} from "../tree/main.js";
import{getClassMatrix, getCol, sortAttributes, quickSort}from "../tree/id3help.js";

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

let treeRootID3 = new NodeID3;
const leafAttr = new attrBranch("leaf", null, null);
let curDepth;

function readDataID3(lines){
    for (let line of lines)
    {
        if (line != ""){
            data.push(line.split(change));
        }
    }
}

function buildDecisionTreeID3(){
    function make() {
        let attributes = sortAttributes();//сортировка атрибутов
        if (attributes.length === 0){
            alert("Некорректные данные");
            document.getElementsByName("alg")[0].disabled = false;
            document.getElementsByName("alg")[1].disabled = false;
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

    treeRootID3 = new NodeID3();
    clearPathID3(treeRootID3); //очистка пути обхода

    treeRootID3 = make();//построение
    if (treeRootID3 != null){
        treeCuttingID3(treeRootID3);//сокращение дерева
        displayID3(treeRootID3, document.getElementById("root"));//отображение
    }
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
    if (curNode.branches.length === 0) {//остановка на листе
        return;
    }
    const newNode = document.createElement("ul");//создание вершины
    newBranch.appendChild(newNode);//добавление вершины
    for (let branch of curNode.branches) {
        displayID3(branch, newNode);
    }
}

function getBranchesID3(queue, attributes) {
    let curIndex = 1;//индекс добавляемой вершины
    curDepth = depth;
    while (queue.length != 0 && curIndex < attributes.length) {
        let curNode = queue.shift();//извлечение вершины
        let branches = sortBranches(curNode.attrBranch.index);//ответвления от вершины

        if (attributes.length - curIndex < branches.length || curDepth >= maxDepth - 2) {//обозначение листьев
            let count = branches.length - attributes.length + curIndex;
            for (let i = 0; i < count; i++) {
                attributes.push(leafAttr);
            }
        }
        if (curDepth < maxDepth - 2)
        {
            for (let i in branches) {//добавление веток к вершине
                if (curIndex < attributes.length) {
                    curNode.branches.push(new NodeID3(`${curNode.attrBranch.nameAttr} = ${branches[i]}`, attributes[curIndex], branches[i]));
                    queue.push(curNode.branches[i]);
                    curIndex++;
                }
            }
            curDepth++;
        }
    }
}
function sortBranches(colIndex) {
    let branches = new Set(getCol(data, colIndex));//возможные ответвления
    let count = [];

    for (let branch of branches) {
        count.push(getClassMatrix(colIndex, branch).length);//количество вхождений значения ветки
    }
    branches = Array.from(branches);
    return quickSort(count, branches, 0, count.length - 1);
}

function getLeaves(curNode, curData) {
    if (curNode.branches.length != 0) {//поиск листьев
        for (let branch of curNode.branches) {
 
            let newData = getClassMatrix(curNode.attrBranch.index,branch.attrVal); 
            
            getLeaves(branch, newData);//продолжение добавление листьев
        }
    }
    else {//добавление листьев
        let beforeLeaf = new Set(getCol(data, curNode.attrBranch.index));//возможные варианты прохода до листа
        beforeLeaf = Array.from(beforeLeaf);
        for (let i in beforeLeaf) {
            if (curNode.attrBranch != leafAttr && curDepth < maxDepth - 1){
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
    if (curData.length === 0) {//отсутствие информации
        return "unknown";
    }

    let answers = new Set(getCol(curData, curData[0].length - 1, 0));
    let count = [];
    for (let ans of answers) {//нахождение количества ответов по заданному атрибуту
        count.push(getClassMatrix(curData[0].length - 1, ans, getClassMatrix(attr.index, beforeLeaf, curData)).length);
    }
    answers = Array.from(answers);
    //return Math.max.apply(null,count) === Math.min.apply(null,count) && count.length != 1 || Math.max.apply(null,count) === 0? 
    //"unknown" : answers[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
    return Math.max.apply(null,count) === 0? "unknown" : answers[count.indexOf(Math.max.apply(null,count))];//самый частовстречающийся ответ
}

function treeCuttingID3(curNode) {
    if (curNode.branches.length === 1) {//возврат значения листа
        return [curNode.branches[0].attrVal];
    }

    let res = [];
    for (let branch of curNode.branches) {
            let branchesAnswers = treeCuttingID3(branch);
            for (let branchAns of branchesAnswers) {
                res.push(branchAns);//нахождение значений листьев вершины
            }
    }

    if (new Set(res).size === 1) {//сокращение вершины если значения листьев одинаковые
        curNode.branches = [curNode.branches[0].branches[0]];
    }

    return res;
}

async function bypassDecisionTreeID3(userData){
    let curNode = treeRootID3;//начало обхода
    clearPathID3(treeRootID3);
    while (curNode != null) {
        await new Promise(resolve => setTimeout(resolve, 100));
        curNode = findPathTreeID3(curNode, userData);   
    }
};
function findPathTreeID3(curNode, userData) {
    let flag = false;//пометка для выхода из цикла, если пути не существует
    if (curNode == null) {//завершение
        return;
    }
    if (curNode === treeRootID3) {//проход через корень
        treeRootID3.path = true;//пометка вершины пути
        clear();
        displayID3(treeRootID3, document.getElementById("root"));
    }
    for (let branch of curNode.branches) {
        if (userData[curNode.attrBranch.index] === branch.attrVal || curNode.branches.length === 1) {
            curNode = branch;//следующая вершина
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

function deleteDecisionTreeID3(){
    treeRootID3 = new NodeID3;
    clearPathID3(treeRootID3);
}
function clearPathID3(curNode) {
    curNode.path = false;
    for (let branch of curNode.branches) {
        clearPathID3(branch);
    }
}
