export{getRes, getSplit}
import { NodeCART, attrsForSearch, attrs} from "../tree/cart.js";
import{getCol}from "../tree/id3help.js";

function getRes(curData) {
    let ans = [];
    for (let row of curData){
        ans.push(row[curData[0].length - 1]);
    }
    return ans;
}
function getClassesRes(groups) {
    let classes = new Set();
    for (let group of groups) {
        let classesRes = getRes(group);
        for (let res of classesRes){
            classes.add(res);
        }
    }
    return Array.from(classes);
}
function countGroupElements(groups) {
    let count = 0;
    for (let group of groups) {
        count += group.length;
    }
    return count;
}
function getProportion(curData, clas) {
    let count = 0;
    for (let row of curData) {
        if (clas === row[curData[0].length - 1]) {
            count++;
        }
    }
    return count / curData.length;
}

function getSplit(curData) {//поиск самого удачного разделения данных по индексу Джини
    let newNode, minGini;
    for (let index = 0; index < curData[0].length - 1; index++) {
        let classes = new Set(getCol(curData,index,0));//возможные варианты разделения по значению из столбца
        classes.delete("");
        for (let clas of classes){
            let groups = groupSplit(index, clas, curData);//разделения по значению из столбца
            let gini = giniIndex(groups);//расчет индекса
            if (gini < minGini || minGini == null) {//подбор наилучшего результата
                newNode = new NodeCART(attrsForSearch.indexOf(attrs[index]),clas, groups[0], groups[1]);
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
    
    for (let group of groups){
        if (group.length === 0) return;
        let allSum = 0;
        for (let res of classesRes){
            let proportion = getProportion(group, res);
            allSum += (proportion*proportion);
        }
        gini += (1 - allSum) * (group.length / groupsLength);
    }

    return gini;
}
function groupSplit(colIndex, clas, curData) {
    let left = [], right = [];
    for (let row of curData){
        if ((typeof(row[colIndex]) === "string") &&  clas === row[colIndex] ||
        (typeof(row[colIndex]) != "string") && row[colIndex] > clas) {//если элемент подходит критерию - влево
            left.push(row);
        } else if (row[colIndex] != ""){// иначе - вправо
            right.push(row);
        }
    }
    return [left, right];
}