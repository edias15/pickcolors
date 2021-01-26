import React, {useState, useEffect, useCallback} from 'react';
import { ChromePicker } from 'react-color'
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import {loadSavedData, saveDataInStorage} from "../../renderer.js";
import List from "../list/List";
import { 
  Container, 
  ContainerLabels,
  ContainerSwitch,
  ContainerToggle,
  LabelToggle,
  ContainerSave,
  Footer,
  Label, 
  Input, 
  Erro } from './styles.js'
import { useForm } from 'react-hook-form'
import Switch from '../toggleswitch/styles.js'

const fs = require('fs')
const {dialog} = require('electron').remote
const { ipcRenderer } = require("electron")
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA } = require("../../../utils/constants")

const Home = () => {
  const [color, setColor] = useState("");
  const [desc, setDesc] = useState("");
  const [colorsToTrack, setColors] = useState([]);
  const { register, handleSubmit, errors, setValue, getValues } = useForm();
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {loadSavedData()}, []);

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

  const handleChange = (event) => {
    setColor(event.target.value)
  }

  const handleChangeDesc = (event) => {
    setDesc(event.target.value)
  }

  const onSubmit = async ({hex, desc}) => {
    saveDataInStorage({hex, desc})
    setColor("")
    setDesc("")
  }

  const saveFile = () => {
    null
  }

  return (
    <div>
      <ContainerSwitch darkMode={isToggled} backgColor={color}>
        <ContainerToggle>
          <Switch
            id="test-switch"
            toggled={isToggled}
            onChange={e => setIsToggled(e.target.checked)}
          />
          <LabelToggle>{!isToggled?' Reactive background color' : ' Background color white'}</LabelToggle>
        </ContainerToggle>
        <Container>
          <ChromePicker
            color={color}
            onChange={(color) => setColor(color.hex)}
            onChangeComplete={(color) => setColor(color.hex)}
          />
          <ContainerLabels>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlfor="hex">Hex</Label>
            <Input type="text" id="hex" name="hex" ref={register({required: true})} onChange={handleChange} value={color}/>
            {errors.hex && <Erro>Hexcode color is required</Erro>}
            <Label htmlfor="desc">Description</Label>
            <Input type="text" id="desc" name="desc" ref={register({required: true})} placeholder="Type a description" onChange={handleChangeDesc} value={desc}/>
            {errors.desc && <Erro>Description is required</Erro>}
            <Button variant="outline-primary" type="submit" onClick={() => {errors.desc=""? addColor(color) : null}} >
              Add color to list
            </Button>
          </form>
          </ContainerLabels>
        </Container>
      </ContainerSwitch>
      {colorsToTrack.length ? (
        <List colorsToTrack={colorsToTrack} />
      ) : (
        <p>Add new color</p>
      )}
      <ContainerSave>
        <Button variant="outline-primary" type="submit" onClick={() => {saveFile()}} >
          Save list in file
        </Button>
      </ContainerSave>
      <Footer></Footer>
    </div>
  )
}

export default Home
