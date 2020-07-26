const {app, BrowserWindow, ipcMain,dialog} = require('electron').remote
const path = require('electron').remote.require('path')  
const axios = require('electron').remote.require('axios')
const fs = require('electron').remote.require('fs')
var key_file,key,alias
document.getElementById("getKey").addEventListener("click", ()=>{
    dialog.showOpenDialog()
    .then((key)=>{
    key_file=key["filePaths"][0];
    key = fs.readFileSync(key_file, 'utf8')
    document.getElementById("demo").innerHTML=key
    })
    document.getElementById("addButton").addEventListener("click", () => { 
        alias = document.getElementById("alias").value      
        if(alias == ""){
            alert("Please enter a valid alias")
        }
        else{
            axios.post ("http://localhost:3000/addAlias", { "alias" : alias,"publicKey" : key})
            .then(response => {
                console.log("Request sent");
                console.log(response.status)
            })
            .catch((err) => {
                console.log("Error in sending request");
            })
        }
    });
})
