import styled from 'styled-components'

export const Container = styled.div`
  padding: 9px;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const ContainerSwitch = styled.div`
  height: 66vh;
  transition: background-color 300ms linear;
  padding: 1em;
  background-color: ${props => (props.darkMode ? props.backgColor : "white")};
`;

export const ContainerToggle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`
export const ContainerSave = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 114px;
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
export const ContainerLabels = styled.div`
  padding: 36px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
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
