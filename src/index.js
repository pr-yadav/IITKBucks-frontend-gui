const {app, BrowserWindow, ipcMain} = require('electron').remote
const crypto = require('electron').remote.require('crypto');
const path = require('electron').remote.require('path')
const fs = require('electron').remote.require('fs'); 
document.getElementById("addAlias").addEventListener("click", () => { 
   var main = new BrowserWindow({
      /*backgroundColor: '#2e2c29',*/
      width: 600, 
      height: 600,
      webPreferences : {nodeIntegration: true}
   }) 
   main.loadFile(path.join(__dirname,'addAlias.html'))
   main.removeMenu()
   //main.openDevTools()
   main.once('ready-to-show', () => {
      main.show()
   })
});
document.getElementById("generateKey").addEventListener("click", () => { 
   const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
  });
  fs.writeFileSync('public.pem',publicKey);
  fs.writeFileSync('private.pem',privateKey);
  alert("Keys saved in files public.pem and private.pem")
  console.log("Keys saved in files public.pem and private.pem");
});
document.getElementById("balance").addEventListener("click", () => { 
   var main = new BrowserWindow({
      /*backgroundColor: '#2e2c29',*/
      width: 600, 
      height: 600,
      webPreferences : {nodeIntegration: true}
   }) 
   main.loadFile(path.join(__dirname,'balance.html'))
   main.removeMenu()
   //main.openDevTools()
   main.once('ready-to-show', () => {
      main.show()
   })
});
document.getElementById("transaction").addEventListener("click", () => { 
   var main = new BrowserWindow({
      /*backgroundColor: '#2e2c29',*/
      width: 6000, 
      height: 6000,
      webPreferences : {nodeIntegration: true}
   }) 
   main.loadFile(path.join(__dirname,'transaction.html'))
   main.removeMenu()
   main.webContents.openDevTools()  //main.openDevTools()
   main.once('ready-to-show', () => {
      main.show()
   })
});