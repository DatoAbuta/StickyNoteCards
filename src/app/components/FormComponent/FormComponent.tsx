import React, { ChangeEvent } from "react";

interface FormComponentProps {
    value: string;
    onchange: (event: ChangeEvent<HTMLInputElement>) => void;
    HandleTextSubmit: any
  }

export default function FormComponent({value, onchange, HandleTextSubmit}: FormComponentProps) {
  return (
    <form onSubmit={HandleTextSubmit}>
      <input
        type="text"
        value={value}
        onChange={onchange}
        className="mt-5 rounded-full outline-none pl-3 "
      />
    </form>
  );
}
