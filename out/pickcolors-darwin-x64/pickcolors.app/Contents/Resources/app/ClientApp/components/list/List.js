import React from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";
import {removeDataFromStorage} from "../../renderer.js"

const List = ({colorsToTrack}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Color</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {colorsToTrack.map((color, i) => {
          return (
            <tr key={i+1}>
              <td>{i+1}</td>
              <td>{color}</td>
              <td>
                <Button
                  variant="outline-danger"
                  onClick={() => removeDataFromStorage(color)}
                >Remove</Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default List;
