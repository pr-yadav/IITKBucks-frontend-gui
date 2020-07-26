const {app, BrowserWindow, ipcMain} = require('electron') 
const url = require('url') 
const path = require('path')  
require('electron-reload')(__dirname)
let win

function createWindow() { 
   win = new BrowserWindow({
      /*backgroundColor: '#2e2c29',*/
      width: 800, 
      height: 600,
      webPreferences : {nodeIntegration: true}
   
   }) 
   win.loadFile(path.join(__dirname,'src','index.html'))
   win.removeMenu()
   win.once('ready-to-show', () => {
      win.show()
   })
}  

app.on('ready', createWindow)  