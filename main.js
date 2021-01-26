'use strict';

const { app, ipcMain, BrowserWindow } = require('electron');
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

let mainWindow, colorsToTrack;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

const defaultDataPath = storage.getDefaultDataPath();
// On Mac: /Users/[username]/Library/ApplicationSupport/expense-tracker-electron/storage

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    con: __dirname + "/assets/icon/mac/pickcolors.icns"
  });

  let indexPath;
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

  mainWindow.webContents.send("info", {msg: "hello from main process"})

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ipcMain methods are how we interact between the window and (this) main program

ipcMain.on(FETCH_DATA_FROM_STORAGE, (event, message) => {
  console.log("Main received: FETCH_DATA_FROM_STORAGE with message:", message)
  storage.get(message, (error, data) => {
    colorsToTrack = JSON.stringify(data) === '{}' ? [] : data;
    if (error) {
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: false,
        message: "colorsToTrack not returned",
      })
    } else {
      // Send message back to window
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: true,
        message: colorsToTrack, // do something with the data
      })
    }
  })
})

ipcMain.on(SAVE_DATA_IN_STORAGE, (event, message) => {
  console.log("Main received: SAVE_DATA_IN_STORAGE")
  // update the colorsToTrack array.
  colorsToTrack.push(message)
  // Save colorsToTrack to storage
  console.log("Main received: SAVE_DATA_IN_STORAGE ---> ", colorsToTrack)
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
});

// Receive a REMOVE_DATA_FROM_STORAGE call from renderer
ipcMain.on(REMOVE_DATA_FROM_STORAGE, (event, message) => {
  console.log('Main Received: REMOVE_DATA_FROM_STORAGE ->>', message)
  // Update the items to Track array.
  colorsToTrack = colorsToTrack.filter(color => (color.hex+color.desc) !== message)
  // Save colorsToTrack to storage
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
