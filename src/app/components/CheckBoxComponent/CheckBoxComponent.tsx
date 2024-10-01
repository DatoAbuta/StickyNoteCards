import React, { ChangeEvent } from 'react'

interface CheckBoxComponentProps {
    checked: boolean;
    onchange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckBoxComponent({onchange, checked}: CheckBoxComponentProps) {
  return (
    <input
    type="checkbox"
    checked={checked}
    onChange={onchange}
    className="mr-2"
  />
  )
}
