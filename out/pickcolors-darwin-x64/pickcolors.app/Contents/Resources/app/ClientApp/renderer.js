const { ipcRenderer } = require("electron");
const { FETCH_DATA_FROM_STORAGE, SAVE_DATA_IN_STORAGE, REMOVE_DATA_FROM_STORAGE} = require("../utils/constants")

function loadSavedData() {
  console.log("Renderer sending: FETCH_DATA_FROM_STORAGE")
  ipcRenderer.send(FETCH_DATA_FROM_STORAGE, "colorsToTrack")
}

function saveDataInStorage(color) {
  console.log("Renderer sending: SAVE_DATA_IN_STORAGE")
  ipcRenderer.send(SAVE_DATA_IN_STORAGE, color)
}

function removeDataFromStorage(color) {
  console.log("Renderer sending: REMOVE_DATA_FROM_STORAGE")
  ipcRenderer.send(REMOVE_DATA_FROM_STORAGE, color)
}

module.exports = { loadSavedData, saveDataInStorage, removeDataFromStorage }
