import React, {useState, useEffect} from 'react';
import Pickercolor from 'react-pick-color'
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import {loadSavedData, saveDataInStorage} from "../../renderer.js";
import List from "../list/List";
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA } = require("../../../utils/constants")

const Home = () => {
  const [color, setColor] = useState("");
  const [colorsToTrack, setColors] = useState([]);

  useEffect(() => {
    loadSavedData();
  }, []);

  // Listener functions that receive messages from main
  useEffect(() => {
    ipcRenderer.on(HANDLE_SAVE_DATA, handleNewItem);
    // If we omit the next step, we will cause a memory leak and & exceed max listeners
    return () => {
      ipcRenderer.removeListener(HANDLE_SAVE_DATA, handleNewItem);
    }
  });
  useEffect(() => {
    ipcRenderer.on(HANDLE_FETCH_DATA, handleReceiveData);
    return () => {
      ipcRenderer.removeListener(HANDLE_FETCH_DATA, handleReceiveData);
    }
  });
  useEffect(() => {
    ipcRenderer.on(HANDLE_REMOVE_DATA, handleReceiveData);
    return () => {
      ipcRenderer.removeListener(HANDLE_REMOVE_DATA, handleReceiveData);
    }
  });

  const handleReceiveData = (event, data) => {
    setColors([...data.message]);
  };

  const handleNewItem = (event, data) => {
    setColors([...colorsToTrack, data.message])
  }

  // Manage state and input field
  const handleChange = (e) => {
    setColor(e.target.value)
  }

  // Send the input to main
  const addColor = (input) => {
    saveDataInStorage(input)
    setColor("")
  }

  return (
    <div>
      <Pickercolor
        color={ color }
        onChange={a => setColor(a.hex)}
      />
      <br/>
      <InputGroup className="mb-3">
        <input type="text" onChange={handleChange} value={color}/>
        <InputGroup.Prepend>
          <Button variant="outline-primary" onClick={() => addColor(color)}>Add color</Button>
        </InputGroup.Prepend>
      </InputGroup>
      {colorsToTrack.length ? (
        <List colorsToTrack={colorsToTrack} />
      ) : (
        <p>Add new item</p>
      )}
    </div>
  )
}

export default Home
