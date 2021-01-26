import React from  'react'

const ToggleSwitch = () => {
  <CheckBoxWrapper className="toggle-switch">
    <CheckBox
      type="checkbox"
      className="toggle-switch-checkbox"
      name="toggleSwitch"
      id="toggleSwitch"
    />
    <CheckBoxLabel className="toggle-switch-label" htmlFor="toggleSwitch">
      <span className="toggle-switch-inner" />
      <span className="toggle-switch-switch" />
    </CheckBoxLabel>
  </CheckBoxWrapper>
}

export default ToggleSwitch
