const {app, BrowserWindow, ipcMain,dialog} = require('electron').remote
const path = require('electron').remote.require('path')  
const axios = require('electron').remote.require('axios')
const fs = require('electron').remote.require('fs')
var key_file,key="",alias
document.getElementById("getKey").addEventListener("click", ()=>{
    dialog.showOpenDialog()
    .then((key)=>{
    key_file=key["filePaths"][0];
    key = fs.readFileSync(key_file, 'utf8')
    document.getElementById("demo").innerHTML=key
    })
})

    document.getElementById("addButton").addEventListener("click", () => { 
        alias = document.getElementById("alias").value      
        if(key == ""){
            axios.post ("http://localhost:3000/getUnusedOutputs", { "alias" : alias})
            .then(response => {
                var balance =0;
                var outputs =response.unusedOutputs;
                for(output in outputs){
                    balance = balance+output["amount"];
                }
                document.getElementById("demo2").innerHTML="Balance : "+balance
            })
            .catch((err) => {
                console.log("Error in sending request");
            })
        }
        else{
            axios.post ("http://localhost:3000/getUnusedOutputs", {"publicKey" : key})
            .then(response => {
                var balance =0;
                var outputs =response.unusedOutputs;
                for(output in outputs){
                    balance = balance+output["amount"];
                }
                document.getElementById("demo2").innerHTML="Balance : "+balance
            })
            .catch((err) => {
                console.log("Error in sending request");
                console.log(err)
            })
        }
    });
