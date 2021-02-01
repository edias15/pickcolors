import styled from 'styled-components'

export const Container = styled.div`
  padding: 15px;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const ContainerSwitch = styled.div`
  height: 75vh;
  transition: background-color 300ms linear;
  padding: 1em;
  background-color: ${props => (props.darkMode ? props.backgColor : "white")};
`;

export const ContainerToggle = styled.div`
  padding: 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`
export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
export const LabelToggle = styled.label`
  margin-left: 10px;
  margin-right: 10px;
`
export const ContainerForms = styled.div`
  padding: 39px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`
export const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-center;
`
export const Label = styled.label`
  margin-left: 10px;
  margin-right: 10px;
`
export const Input = styled.input`
  margin-right: 10px;
`

export const Erro = styled.span`
  margin-left: 10px;
  margin-right: 10px;
  color: red;
`
