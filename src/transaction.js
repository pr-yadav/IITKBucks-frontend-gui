const {app, BrowserWindow, ipcMain,dialog} = require('electron').remote
const path = require('electron').remote.require('path')  
const axios = require('electron').remote.require('axios')
const fs = require('electron').remote.require('fs')
const crypto = require('electron').remote.require('crypto');
const sha256=require('electron').remote.require('sha256');
var key_file,publicKey="",alias,privateKey="",balance=0
var output_hash
var noOfTxns
var keys =[],amounts =[]
var txn = {"inputs" : [],"outputs" : []};
var buf =Buffer.alloc(0);
function IntToBytes (num,bits){
    if(bits==4){
        var buf = Buffer.alloc(4);
        buf.writeInt32BE(num);
    }
    else{
        var buf =Buffer.alloc(8)
        num = BigInt(num)
        buf.writeBigInt64BE(num)
    }
    return buf
}
function createSign(data,privateKey){
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(Buffer.from(data, 'hex'));
    signature = sign.sign({key:privateKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING,saltLength:32}).toString('hex');
    return signature
}
document.getElementById("getPublic").addEventListener("click", ()=>{
    dialog.showOpenDialog()
    .then((key)=>{
    key_file=key["filePaths"][0];
    publicKey = fs.readFileSync(key_file, 'utf-8')
    document.getElementById("public").innerHTML=publicKey
    
    axios.post ("http://localhost:3000/getUnusedOutputs", {"publicKey" : publicKey})
    .then(response => {
        balance =0;
        var outputs =response.unusedOutputs;
        for(output in outputs){
            txn["inputs"].push({
                "transactionId": output["transactionId"],
                "index": output["index"],
                "signature": ""
            })
            balance = balance+output["amount"];
        }
        document.getElementById("balance").innerHTML="Balance : "+balance
    })
    .catch((err) => {
        console.log("Error in sending request");
        console.log(err)
    })
})
})
document.getElementById("getPrivate").addEventListener("click", ()=>{
    dialog.showOpenDialog()
    .then((key)=>{
    key_file=key["filePaths"][0];
    privateKey = fs.readFileSync(key_file, 'utf-8')
    document.getElementById("private").innerHTML=privateKey
    })
    
})
document.getElementById("nextBtn").addEventListener("click",()=>{
    noOfTxns=document.getElementById("noOfTxns").value
    output_hash=IntToBytes(noOfTxns+1,4)
    for(var i=0;i<noOfTxns;i++){
        //var x_label=document.createElement("LABEL");
        //x_label.setAttribute("for","alias"+i)
        //var textnode = document.createTextNode("Alias ");
        //x_label.appendChild(textnode)
        var x = document.createElement("button");
        //x.setAttribute("type", "text");
        x.id="key"+i;
        x.innerHTML="Public Key of User"
        var y_label=document.createElement("label");
        y_label.setAttribute("for","amount"+i)
        var textnode2 = document.createTextNode("       Amount ");
        y_label.appendChild(textnode2)
        var y = document.createElement("INPUT");
        y.setAttribute("type", "text");
        y.id="amount"+i
        //document.getElementById("postForm").appendChild(x_label)
        document.getElementById("postForm").appendChild(x)

        // document.body.appendChild(document.createElement("br"))
        document.getElementById("postForm").appendChild(y_label)
        document.getElementById("postForm").appendChild(y)
        document.getElementById("postForm").appendChild(document.createElement("br"))
    }
    var txnBtn=document.createElement("button");
    txnBtn.id="txnBtn"
    txnBtn.innerHTML="Make Transaction"
    document.body.appendChild(txnBtn)
    for(var i=0;i<noOfTxns;i++){
        document.getElementById("key"+i).addEventListener("click", ()=>{
            dialog.showOpenDialog()
            .then((key)=>{
            key_file=key["filePaths"][0];
            keys.push(fs.readFileSync(key_file, 'utf-8'))
            })
        })
    }
    document.getElementById("txnBtn").addEventListener("click",()=>{
        for(var i=0;i<noOfTxns;i++){
            amounts.push(document.getElementById("amount"+i).value)
        }
        for(var i=0;i<noOfTxns;i++){
            txn["outputs"].push({
                "amount": amounts[i],
                "recipient": keys[i]
            })
            balance=balance-amounts[i]
            //alert(amounts[i])
            output_hash=Buffer.concat([output_hash,IntToBytes(amounts[i],8),IntToBytes(Buffer.byteLength(keys[i]),4),Buffer.from(keys[i],'utf-8')])
        }
        if(balance<document.getElementById("txnReward").value){
            alert("Invalid Transaction")
        }
        else{
            txn["outputs"].push({
                "amount": balance-document.getElementById("txnReward").value,
                "recipient": publicKey
            })
            output_hash=Buffer.concat([output_hash,IntToBytes(balance-document.getElementById("txnReward").value,8),IntToBytes(Buffer.byteLength(publicKey),4),Buffer.from(publicKey,'utf-8')])
            output_hash=Buffer.from(sha256(output_hash),'hex')
            for(var input in txn["inputs"]){
                buf = Buffer.concat([Buffer.from(input["transactionId"],'hex'),IntToBytes(input["index"],4),output_hash]);
                input["signature"] = createSign(buf,privateKey)
            }
            axios.post ("http://localhost:3000/newTransaction", txn)
            .then(response => {
                console.log(response.statusText)
                alert("Transaction added")
            })
            .catch((err) => {
                console.log("Error in sending request");
                console.log(err)
            })
        }
    })
})
// for(var i=0;i<noOfTxns;i++){
// document.getElementById("txnBtn").addEventListener("click", ()=>{
//     dialog.showOpenDialog()
//     .then((key)=>{
//     key_file=key["filePaths"][0];
//     keys.push(fs.readFileSync(key_file, 'utf-8'))
//     })
// })
// }