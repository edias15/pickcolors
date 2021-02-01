'use strict';

const { app, ipcMain, dialog, BrowserWindow, Menu } = require('electron');
const path = require('path')
const url = require('url')
const {
  HANDLE_FETCH_DATA, 
  FETCH_DATA_FROM_STORAGE, 
  HANDLE_SAVE_DATA, 
  SAVE_DATA_IN_STORAGE, 
  REMOVE_DATA_FROM_STORAGE,
  HANDLE_REMOVE_DATA}
  = require("./utils/constants")
const storage = require("electron-json-storage")

const isMac = process.platform === 'darwin'

let mainWindow, colorsToTrack, HexDesc
// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

const defaultDataPath = storage.getDefaultDataPath();
// On Mac: /Users/[username]/Library/ApplicationSupport/pickcolors/storage

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 720,
    title: "Pickcolors",
    icon: __dirname + "/assets/icon/mac/pickcolors.icns",
    webPreferences: {
      nodeIntegration: true
    }
  });

  let indexPath
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  const templateMenu = [
    {
      label: "File",
      submenu: [
        {
          label: "Quit",
          role: isMac ? "quit" : "close"
        }
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(templateMenu)
  Menu.setApplicationMenu(menu)
  
  mainWindow.webContents.send("info", {msg: "hello from main process"})

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(FETCH_DATA_FROM_STORAGE, (event, message) => {
  console.log("Main received: FETCH_DATA_FROM_STORAGE with message --> :", message)
  storage.get(message, (error, data) => {
    colorsToTrack = JSON.stringify(data) === '{}' ? [] : data;
    if (error) {
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: false,
        message: "colorsToTrack not returned",
      })
    } else {
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: true,
        message: colorsToTrack,
      })
    }
  })
})

ipcMain.on(SAVE_DATA_IN_STORAGE, (event, message) => {
  colorsToTrack.push(message)
  storage.set("colorsToTrack", colorsToTrack, (error) => {
    if (error) {
      console.log("We errored! What was data?")
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: false,
        message: "colorsToTrack not saved",
      })
    } else {
      // Send message back to window as 2nd arg "data"
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: true,
        message: message,
      })
    }
  })
})

ipcMain.on(REMOVE_DATA_FROM_STORAGE, (event, message) => {
  colorsToTrack = colorsToTrack.filter(color => (color.desc+color.hex) !== message)
  storage.set("colorsToTrack", colorsToTrack, (error) => {
    if (error) {
      console.log("We errored! What was data?")
      mainWindow.send(HANDLE_REMOVE_DATA, {
        success: false,
        message: "colorsToTrack not saved",
      })
    } else {
      // Send new updated array to window as 2nd arg "data"
      mainWindow.send(HANDLE_REMOVE_DATA, {
        success: true,
        message: colorsToTrack,
      })
    }
  })
})
