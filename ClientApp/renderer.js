const { ipcRenderer } = require("electron");
const {
  FETCH_DATA_FROM_STORAGE,
  SAVE_DATA_IN_STORAGE,
  REMOVE_DATA_FROM_STORAGE} = require("../utils/constants")

function loadSavedData() {
  ipcRenderer.send(FETCH_DATA_FROM_STORAGE, "colorsToTrack")
}

function saveDataInStorage(color) {
  ipcRenderer.send(SAVE_DATA_IN_STORAGE, color)
}

function removeDataFromStorage(color) {
  console.log('Renderer Remove : ', color)
  ipcRenderer.send(REMOVE_DATA_FROM_STORAGE, color)
}

module.exports = { 
  loadSavedData,
  saveDataInStorage,
  removeDataFromStorage }
