import { deleteDecisionTreeCART, readDataCART, buildDecisionTreeCART, bypassDecisionTreeCART } from "../tree/cart.js";
import {deleteDecisionTreeID3, readDataID3, buildDecisionTreeID3, bypassDecisionTreeID3} from "../tree/id3.js";
export{change, data, depth, maxDepth, clear}


document.getElementById("fileInput").addEventListener("change", fileInput);
document.getElementById("buildDecisionTree").addEventListener("click", buildDecisionTree);
document.getElementById("separator").addEventListener("change", separator);
document.getElementById("bypassDecisionTree").addEventListener("click", bypassDecisionTree);
document.getElementById("deleteDecisionTree").addEventListener("click", deleteDecisionTree);

let data = [], depth, maxDepth;
let reader;
let change = document.getElementById('separator').value;

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
    }
}

function buildDecisionTree(){
    data = [];
    if (document.getElementById("fileInput").value != ""){
        let lines = reader.result.split('\r\n');
        readData(lines);
    }
    if (data.length <= 1 || data[0].length <= 1){
        if(document.getElementById("userInput").value != ""){
            data = [];
            readData(document.getElementById("userInput").value.split("\n"));
            if (data.length > 1 && data[0].length > 1){
                document.getElementById("fileInput").disabled = true;
            }
        }
    }
    if (data.length <= 1 || data[0].length <= 1){
        alert("Некорректные данные");
        document.getElementsByName("alg")[0].disabled = false;
        document.getElementsByName("alg")[1].disabled = false;
    }
    else{
        depth = 1;
        maxDepth = document.getElementById('maxDepth').value;
        clear();//очистка поля

        if (document.getElementsByName("alg")[1].checked){
            document.getElementsByName("alg")[0].disabled = true;
            buildDecisionTreeCART();
        }
        else{
            document.getElementsByName("alg")[1].disabled = true;
            buildDecisionTreeID3();
        }  
    }
}

async function bypassDecisionTree(){
    if (document.getElementById("root").innerHTML === "") {
        alert("Постройте дерево")
    }
    else{
        const userData = document.getElementById("findUserInput").value.split(change);//данные для обхода
        if (userData[0] !== ""){
            if (document.getElementsByName("alg")[1].checked){
                bypassDecisionTreeCART(userData);
            }
            else{
                bypassDecisionTreeID3(userData);
            }
        }
        else{
            alert("Введите данные для обхода");
        }
    }
}

function separator() {
    change = document.getElementById('separator').value;
}

function deleteDecisionTree(){

    data = [];
    clear();
    document.getElementById("userInput").value = "";
    document.getElementById("fileInput").value = "";
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

function clear() {
    document.getElementById("root").innerHTML = "";
}

function readData(lines){
    if (document.getElementsByName("alg")[1].checked){
        readDataCART(lines);
    }
    else{
        readDataID3(lines);
    }  
}

