import React, {useState, useEffect, useCallback} from 'react';
import { SketchPicker } from 'react-color'
import Button from 'react-bootstrap/Button';
import {loadSavedData, saveDataInStorage} from "../../renderer.js";
import List from "../list/List";
import {
  Container,
  ContainerForms,
  ContainerSwitch,
  ContainerToggle,
  LabelToggle,
  ContainerList,
  Footer,
  Label,
  Input,
  Erro } from './styles.js'
import { useForm } from 'react-hook-form'
import namedColors from 'color-name-list'
import Switch from '../toggleswitch/styles.js'
var _ = require('lodash')

const { ipcRenderer } = require("electron")
const { 
  HANDLE_FETCH_DATA, 
  HANDLE_SAVE_DATA, 
  HANDLE_REMOVE_DATA} = require("../../../utils/constants")

const Pickcolors = () => {
  const [color, setColor] = useState("")
  const [desc, setDesc] = useState("")
  const [colorsToTrack, setColors] = useState([])
  const { register, handleSubmit, errors } = useForm()
  const [isToggled, setIsToggled] = useState(false)

  useEffect(() => {loadSavedData()}, []);
  
  useEffect(() => {
    const colorHex = color.replace('#','')
    if (colorHex.length === 6) {
      fetch(`https://api.color.pizza/v1/${colorHex}`)
        .then(r => {
          return r.json()
        })
        .then(jsonBody => {
          setDesc(jsonBody.colors[0].name)
        })
        .catch((error) => {
          alert('Ops : ' + error)
        })
    }
  },[color])

  // Listener functions that receive messages from main
  useEffect(() => {
    ipcRenderer.on(HANDLE_SAVE_DATA, handleNewItem);
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
    setColors([...data.message]);  };

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
          <SketchPicker
            color={color}
            onChange={(color) => setColor(color.hex)}
            onChangeComplete={(color) => setColor(color.hex)}
          />
          <ContainerForms>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlfor="hex">Hex</Label>
            <Input type="text" id="hex" name="hex" ref={register({required: true})} onKeyUp={handleChange} onChange={handleChange} value={color}/>
            {errors.hex && <Erro>Hexcode color is required</Erro>}
            <Label htmlfor="desc">Description</Label>
            <Input type="text" id="desc" name="desc" ref={register({required: true})} placeholder="Type a description" onKeyUp={handleChangeDesc} onChange={handleChangeDesc} value={desc}/>
            {errors.desc && <Erro>Description is required</Erro>}
            <Button variant="outline-primary" type="submit" onClick={() => {errors.desc=""? addColor(color) : null}} >
              Add color to list
            </Button>
          </form>
          </ContainerForms>
        </Container>
      </ContainerSwitch>
      <ContainerList>
        {colorsToTrack.length ? (
          <List colorsToTrack={colorsToTrack}/>
        ) : (
          <p>Add new color</p>
        )}
      </ContainerList>
      <Footer></Footer>
    </div>
  )
}

export default Pickcolors
