import React from 'react'
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"
import {removeDataFromStorage} from "../../renderer.js"
import { Container } from "./styles.js"

function List({ colorsToTrack }) {
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
        {colorsToTrack.map((a, i) => {
          return (
            <tr key={i + 1}>
              <td>{i + 1}</td>
              <td>{colorsToTrack[i].hex}</td>
              <td>{colorsToTrack[i].desc}</td>
              <td>
                <Container>
                  <Button
                    variant="outline-danger"
                    onClick={() => removeDataFromStorage(colorsToTrack[i].desc + colorsToTrack[i].hex)}
                  >Remove</Button>
                </Container>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default List;
